import SeedService from '../key-vault/seed.service';
import AccountKeyVaultService from '../account/account-key-vault.service';
import KeyVaultService from '../key-vault/key-vault.service';
import ProcessClass from './process.class';

export default class RestoreProcess extends ProcessClass {
  public readonly seedService: SeedService;
  public readonly accountKeyVaultService: AccountKeyVaultService;
  public readonly keyVaultService: KeyVaultService;
  public readonly actions: Array<any>;

  constructor(storeName: string) {
    super();
    this.seedService = new SeedService(storeName);
    this.accountKeyVaultService = new AccountKeyVaultService(storeName);
    this.keyVaultService = new KeyVaultService(storeName);
    this.actions = [
      { instance: this.accountKeyVaultService, method: 'createWallet' },
      { instance: this.seedService, method: 'seedFromMnemonicGenerate' },
      // { instance: this.accountKeyVaultService, method: 'createAccount' },
      // { instance: this.accountKeyVaultService, method: 'createAccount' },
      // { instance: this.accountKeyVaultService, method: 'createAccount' },
      // { instance: this.accountKeyVaultService, method: 'createAccount' },
      // { instance: this.accountKeyVaultService, method: 'createAccount' },
      // { instance: this.keyVaultService, method: 'updateVaultStorage' },
    ];
  }
}
