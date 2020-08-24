import { StoreService, resolveStoreService } from '../store-manager/store.service';
import AccountKeyVaultService from './account-key-vault.service';
import BloxApiService from '../communication-manager/blox-api.service';
import { step } from '../decorators';
import { METHOD } from '../communication-manager/constants';

export default class AccountService {
  private readonly storeService: StoreService;
  private readonly accountKeyVaultService: AccountKeyVaultService;

  constructor(storePrefix: string = '') {
    this.storeService = resolveStoreService(storePrefix);
    this.accountKeyVaultService = new AccountKeyVaultService();
  }

  get = async () => {
    const accounts = await BloxApiService.request(METHOD.GET, 'accounts');
    return JSON.parse(accounts);
  };

  create = async (payload: any) => {
    const account = await BloxApiService.request(METHOD.POST, 'accounts', payload);
    return JSON.parse(account);
  };

  delete = async () => {
    return await BloxApiService.request(METHOD.DELETE, 'accounts');
  };

  updateStatus = async (route: string, payload: any) => {
    if (!route) {
      throw new Error('route');
    }
    return await BloxApiService.request(METHOD.PATCH, `accounts/${route}`, payload);
  };

  getLatestTag = async () => {
    return await BloxApiService.request(METHOD.GET, 'key-vault/latest-tag');
  };

  @step({
    name: 'Create Blox Account',
    requiredConfig: ['authToken']
  })
  async createBloxAccount(): Promise<any> {
    const lastIndexedAccount = await this.accountKeyVaultService.getLastIndexedAccount();
    if (!lastIndexedAccount) {
      throw new Error(`No account to create`);
    }
    try {
      const account = await this.create(lastIndexedAccount);
      return { data: account };
    } catch (error) {
      throw new Error(`STEP: Create Blox Account error: ${error}`);
    }
  }

  @step({
    name: 'Remove Blox Accounts',
    requiredConfig: ['authToken']
  })
  async deleteBloxAccounts(): Promise<void> {
    try {
      await this.delete();
      this.storeService.delete('keyVaultStorage');
    } catch (error) {
      throw new Error(`STEP: Remove Blox Accounts step error: ${error}`);
    }
  }
}
