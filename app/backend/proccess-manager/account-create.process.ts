import AccountKeyVaultService from '../services/account/account-key-vault.service';
import KeyVaultService from '../services/key-vault/key-vault.service';
import ProcessClass from './process.class';
import AccountService from '../services/account/account.service';
import Store from '../common/store-manager/store';

export default class AccountCreateProcess extends ProcessClass {
  private readonly accountKeyVaultService: AccountKeyVaultService;
  private readonly accountService: AccountService;
  private readonly keyVaultService: KeyVaultService;
  public readonly actions: Array<any>;
  public readonly fallbackActions: Array<any>;

  constructor(network: string) {
    super();
    const store: Store = Store.getStore();
    store.set('network', network);
    this.accountKeyVaultService = new AccountKeyVaultService();
    this.keyVaultService = new KeyVaultService();
    this.accountService = new AccountService();
    this.actions = [
      { instance: this.accountKeyVaultService, method: 'createWallet' },
      { instance: this.accountKeyVaultService, method: 'createAccount' },
      { instance: this.keyVaultService, method: 'updateVaultStorage' },
      { instance: this.accountService, method: 'createBloxAccount' }
    ];

    this.fallbackActions = [
      {
        method: 'updateVaultStorage',
        actions: [{ instance: this.accountKeyVaultService, method: 'deleteLastIndexedAccount' }]
      },
      {
        method: 'createBloxAccount',
        actions: [
          { instance: this.accountKeyVaultService, method: 'deleteLastIndexedAccount' },
          { instance: this.keyVaultService, method: 'updateVaultStorage' }
        ]
      }
    ];
  }
}
