import BloxApiService from '../communication-manager/blox-api.service';
import { METHOD } from '../communication-manager/constants';
import { resolveStoreService, StoreService } from '../store-manager/store.service';
import KeyVaultSshService from '../communication-manager/key-vault-ssh.service';
import { CatchClass, Step } from '../decorators';

@CatchClass<WalletService>()
export default class WalletService {
  private readonly storeService: StoreService;
  private readonly keyVaultSshService: KeyVaultSshService;

  constructor(storePrefix: string = '') {
    this.storeService = resolveStoreService(storePrefix);
    this.keyVaultSshService = new KeyVaultSshService(storePrefix);
  }

  async get() {
    return await BloxApiService.request(METHOD.GET, 'wallets');
  }

  async sync(payload: any) {
    return await BloxApiService.request(METHOD.POST, 'wallets/sync', payload);
  }

  async reSync(payload: any) {
    return await BloxApiService.request(METHOD.PATCH, 'wallets/sync', payload);
  }

  async delete() {
    // TODO request to delete wallet and not organization
    await BloxApiService.request(METHOD.DELETE, 'organizations');
  }

  async getLatestTag() {
    return await BloxApiService.request(METHOD.GET, 'key-vault/latest-tag');
  }

  @Step({
    name: 'Remove blox wallet',
    requiredConfig: ['authToken']
  })
  async removeBloxWallet(): Promise<void> {
    const ssh = await this.keyVaultSshService.getConnection();
    const command = this.keyVaultSshService.buildCurlCommand({
      authToken: this.storeService.get('authToken'),
      method: METHOD.DELETE,
      route: `${BloxApiService.baseUrl}/organizations`
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
    const ssh = await this.keyVaultSshService.getConnection();
    const payload = {
      url: `http://${this.storeService.get('publicIp')}:8200`,
      accessToken: this.storeService.get('vaultRootToken')
    };
    const command = this.keyVaultSshService.buildCurlCommand({
      authToken: this.storeService.get('authToken'),
      method: METHOD.POST,
      data: payload,
      route: `${BloxApiService.baseUrl}/wallets/sync`
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
    const ssh = await this.keyVaultSshService.getConnection();
    const payload = {
      url: `http://${this.storeService.get('publicIp')}:8200`,
      accessToken: this.storeService.get('vaultRootToken')
    };
    const command = this.keyVaultSshService.buildCurlCommand({
      authToken: this.storeService.get('authToken'),
      method: METHOD.PATCH,
      data: payload,
      route: `${BloxApiService.baseUrl}/wallets/sync`
    });
    const { stdout: statusCode, stderr } = await ssh.execCommand(command, {});
    if (+statusCode > 201) {
      console.log(`ssh error - ${stderr} - retrying directly`);
      await this.reSync(payload);
    }
  }
}
