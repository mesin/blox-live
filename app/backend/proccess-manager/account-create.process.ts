import AccountKeyVaultService from '../account/account-key-vault.service';
import KeyVaultService from '../key-vault/key-vault.service';
import ProcessClass from './process.class';
import AccountService from '../account/account.service';

export default class AccountCreateProcess extends ProcessClass {
  private readonly accountKeyVaultService: AccountKeyVaultService;
  private readonly accountService: AccountService;
  private readonly keyVaultService: KeyVaultService;
  public readonly actions: Array<any>;
  public readonly fallbackActions: Array<any>;

  constructor() {
    super();
    this.accountKeyVaultService = new AccountKeyVaultService();
    this.keyVaultService = new KeyVaultService();
    this.accountService = new AccountService();
    this.actions = [
      { instance: this.accountKeyVaultService, method: 'createAccount' },
      { instance: this.keyVaultService, method: 'initKeyVaultApi' },
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
