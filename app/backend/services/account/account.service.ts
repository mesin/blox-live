import Store from '../../common/store-manager/store';
import AccountKeyVaultService from './account-key-vault.service';
import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';
import { Catch, CatchClass, Step } from '../../decorators';

@CatchClass<AccountService>()
export default class AccountService {
  private readonly store: Store;
  private readonly accountKeyVaultService: AccountKeyVaultService;

  constructor(storePrefix: string = '') {
    this.store = Store.getStore(storePrefix);
    this.accountKeyVaultService = new AccountKeyVaultService();
  }

  async get() {
    return await BloxApi.request(METHOD.GET, 'accounts');
  }

  async create(payload: any) {
    return await BloxApi.request(METHOD.POST, 'accounts', payload);
  }

  async delete() {
    return await BloxApi.request(METHOD.DELETE, 'accounts');
  }

  async updateStatus(route: string, payload: any) {
    if (!route) {
      throw new Error('route');
    }
    return await BloxApi.request(METHOD.PATCH, `accounts/${route}`, payload);
  }

  @Step({
    name: 'Create Blox Account',
    requiredConfig: ['authToken']
  })
  @Catch({
    displayMessage: 'Create Blox Account failed'
  })
  async createBloxAccount(): Promise<any> {
    const lastIndexedAccount = await this.accountKeyVaultService.getLastIndexedAccount();
    if (!lastIndexedAccount) {
      throw new Error('No account to create');
    }
    const account = await this.create(lastIndexedAccount);
    return { data: account };
  }

  @Step({
    name: 'Remove Blox Accounts',
    requiredConfig: ['authToken']
  })
  async deleteBloxAccounts(): Promise<void> {
    await this.delete();
    this.store.delete('keyVaultStorage');
  }
}
