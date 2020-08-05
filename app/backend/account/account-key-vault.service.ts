import ElectronStore from 'electron-store';
import KeyVaultCliService from '../key-vault/key-vault-cli.service';
import { step } from '../decorators';


export default class AccountKeyVaultService extends KeyVaultCliService {
  private readonly conf: ElectronStore;

  constructor(storeName: string) {
    super();
    this.conf = new ElectronStore({ name: storeName });
  }

  @step({
    name: 'Create Wallet',
  })
  async createWallet(): Promise<void> {
    if (this.conf.get('keyVaultStorage')) return;
    const { stdout, stderr } = await this.executor(`${this.executablePath} wallet create`);
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    this.conf.set('keyVaultStorage', stdout.replace('\n', ''));
    this.conf.set('keyVaultAccounts', []);
  }

  @step({
    name: 'Create Account',
    requiredConfig: ['seed', 'keyVaultStorage', 'keyVaultAccounts'],
  })
  async createAccount(): Promise<void> {
    const vaultAccounts : any = this.conf.get('keyVaultAccounts')
    const newExisted = vaultAccounts.find(item => !item.syncedWithBlox);
    if (newExisted) {
      return;
    }
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account create --seed=${this.conf.get('seed')} --storage=${this.conf.get('keyVaultStorage')}`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    this.conf.set('keyVaultStorage', stdout.replace('\n', ''));
    // add new created account into store
    const newCreated = await this.getLastCreatedAccount();
    this.conf.set('keyVaultAccounts', [...(vaultAccounts || []), newCreated]);
  }

  async getLastCreatedAccount(): Promise<any> {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account list --storage=${this.conf.get('keyVaultStorage')}`,
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }

    const existedAccounts = stdout ? JSON.parse(stdout) : [];
    console.log('existedAccounts', existedAccounts);
    const lastCreatedAccount = existedAccounts.sort((a, b) => b.name.localeCompare(a.name))[0];
    console.log('lastCreatedAccount', lastCreatedAccount);
    return lastCreatedAccount;
  }
}
