import BloxApiService from '../communication-manager/blox-api.service';
import { METHOD } from '../communication-manager/constants';
import { step } from '../decorators';
import { resolveStoreService, StoreService } from '../store-manager/store.service';
import KeyVaultSshService from '../communication-manager/key-vault-ssh.service';

export default class WalletService {
  private readonly storeService: StoreService;
  private readonly keyVaultSshService: KeyVaultSshService;

  constructor(storePrefix: string = '') {
    this.storeService = resolveStoreService(storePrefix);
    this.keyVaultSshService = new KeyVaultSshService(storePrefix);
  }

  get = async () => {
    const wallets = await BloxApiService.request(METHOD.GET, 'wallets');
    return JSON.parse(wallets);
  };

  sync = async (payload: any) => {
    await BloxApiService.request(METHOD.POST, 'wallets/sync', payload);
  };

  reSync = async (payload: any) => {
    await BloxApiService.request(METHOD.PATCH, 'wallets/sync', payload);
  };

  delete = async () => {
    // TODO request to delete wallet and not organization
    await BloxApiService.request(METHOD.DELETE, 'organizations');
  };

  @step({
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

  @step({
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

  @step({
    name: 'Re-sync vault with blox api',
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
