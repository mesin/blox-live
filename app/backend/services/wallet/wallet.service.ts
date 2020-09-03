import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';
import { resolveStore, Store } from '../../common/store-manager/store';
import KeyVaultSsh from '../../common/communication-manager/key-vault-ssh';
import { CatchClass, Step } from '../../decorators';

@CatchClass<WalletService>()
export default class WalletService {
  private readonly store: Store;
  private readonly keyVaultSsh: KeyVaultSsh;

  constructor(storePrefix: string = '') {
    this.store = resolveStore(storePrefix);
    this.keyVaultSsh = new KeyVaultSsh(storePrefix);
  }

  async get() {
    return await BloxApi.request(METHOD.GET, 'wallets');
  }

  async sync(payload: any) {
    return await BloxApi.request(METHOD.POST, 'wallets/sync', payload);
  }

  async reSync(payload: any) {
    return await BloxApi.request(METHOD.PATCH, 'wallets/sync', payload);
  }

  async delete() {
    // TODO request to delete wallet and not organization
    await BloxApi.request(METHOD.DELETE, 'organizations');
  }

  async getLatestTag() {
    return await BloxApi.request(METHOD.GET, 'key-vault/latest-tag');
  }

  @Step({
    name: 'Remove blox wallet',
    requiredConfig: ['authToken']
  })
  async removeBloxWallet(): Promise<void> {
    const ssh = await this.keyVaultSsh.getConnection();
    const command = this.keyVaultSsh.buildCurlCommand({
      authToken: this.store.get('authToken'),
      method: METHOD.DELETE,
      route: `${BloxApi.baseUrl}/organizations`
    });
    const { stdout: statusCode, stderr } = await ssh.execCommand(command, {});
    if (+statusCode > 201) {
      console.log(`ssh error - ${stderr} - retrying directly`);
      await this.delete();
    }
  }

  @Step({
    name: 'Syncing KeyVault with Blox...',
    requiredConfig: ['publicIp', 'authToken', 'vaultRootToken']
  })
  async syncVaultWithBlox(): Promise<void> {
    const ssh = await this.keyVaultSsh.getConnection();
    const payload = {
      url: `http://${this.store.get('publicIp')}:8200`,
      accessToken: this.store.get('vaultRootToken')
    };
    const command = this.keyVaultSsh.buildCurlCommand({
      authToken: this.store.get('authToken'),
      method: METHOD.POST,
      data: payload,
      route: `${BloxApi.baseUrl}/wallets/sync`
    });
    const { stdout: statusCode, stderr } = await ssh.execCommand(command, {});
    if (+statusCode > 201) {
      console.log(`ssh error - ${stderr} - retrying directly`);
      await this.sync(payload);
    }
  }

  @Step({
    name: 'Re-syncing KeyVault with Blox...',
    requiredConfig: ['publicIp', 'authToken', 'vaultRootToken']
  })
  async reSyncVaultWithBlox(): Promise<void> {
    const ssh = await this.keyVaultSsh.getConnection();
    const payload = {
      url: `http://${this.store.get('publicIp')}:8200`,
      accessToken: this.store.get('vaultRootToken')
    };
    const command = this.keyVaultSsh.buildCurlCommand({
      authToken: this.store.get('authToken'),
      method: METHOD.PATCH,
      data: payload,
      route: `${BloxApi.baseUrl}/wallets/sync`
    });
    const { stdout: statusCode, stderr } = await ssh.execCommand(command, {});
    if (+statusCode > 201) {
      console.log(`ssh error - ${stderr} - retrying directly`);
      await this.reSync(payload);
    }
  }
}
