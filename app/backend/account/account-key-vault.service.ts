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
    name: 'Create Wallet'
  })
  async createWallet(): Promise<void> {
    if (this.conf.get('keyVaultStorage')) return;
    const { stdout, stderr } = await this.executor(`${this.executablePath} wallet create`);
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    this.conf.set('keyVaultStorage', stdout.replace('\n', ''));
  }

  @step({
    name: 'Create Account',
    requiredConfig: ['seed', 'keyVaultStorage']
  })
  async createAccount(): Promise<void> {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account create --seed=${this.conf.get('seed')} --storage=${this.conf.get('keyVaultStorage')}`
    );
    if (stderr) {
      throw new Error(`Create account error: ${stderr}`);
    }
    console.log(stdout);
    this.conf.set('keyVaultStorage', stdout.replace('\n', ''));
  }

  listAccounts = async (): Promise<any> => {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account list --storage=${this.conf.get('keyVaultStorage')}`
    );
    if (stderr) {
      throw new Error(`Get last created account error: ${stderr}`);
    }
    const accounts = stdout ? JSON.parse(stdout) : [];
    console.log(accounts);
    return accounts;
  };

  getLastCreatedAccount = async (): Promise<any> => {
    const accounts = await this.listAccounts();
    if (accounts.length) {
      console.log('account', accounts[0]);
      return accounts[0];
    }
    return;
  };

  getDepositData = async (publicKey: string): Promise<any> => {
    if (!publicKey) {
      throw new Error(`publicKey is empty`);
    }
    publicKey = publicKey.replace(/^(0x)/, '');
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account deposit-data --storage=${this.conf.get('keyVaultStorage')} --public-key=${publicKey}`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    return stdout ? JSON.parse(stdout) : {};
  };

  deleteLastIndexedAccount = async (): Promise<void> => {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account delete --storage=${this.conf.get('keyVaultStorage')}`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    this.conf.set('keyVaultStorage', stdout.replace('\n', ''));
  };
}
