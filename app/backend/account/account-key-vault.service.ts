import StoreService from '../store-manager/store.service';
import KeyVaultCliService from '../key-vault/key-vault-cli.service';
import { step } from '../decorators';


export default class AccountKeyVaultService extends KeyVaultCliService {
  private readonly storeService: StoreService;

  constructor() {
    super();
    this.storeService = new StoreService();
  }

  @step({
    name: 'Create Wallet'
  })
  async createWallet(): Promise<void> {
    if (this.storeService.get('keyVaultStorage')) return;
    const { stdout, stderr } = await this.executor(`${this.executablePath} wallet create`);
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    this.storeService.set('keyVaultStorage', stdout.replace('\n', ''));
  }

  @step({
    name: 'Create Account',
    requiredConfig: ['seed', 'keyVaultStorage']
  })
  async createAccount(): Promise<void> {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account create --seed=${this.storeService.get('seed')} --storage=${this.storeService.get('keyVaultStorage')}`
    );
    if (stderr) {
      throw new Error(`Create account error: ${stderr}`);
    }
    console.log(stdout);
    this.storeService.set('keyVaultStorage', stdout.replace('\n', ''));
  }

  listAccounts = async (): Promise<any> => {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account list --storage=${this.storeService.get('keyVaultStorage')}`
    );
    if (stderr) {
      throw new Error(`Get last created account error: ${stderr}`);
    }
    const accounts = stdout ? JSON.parse(stdout) : [];
    console.log(accounts);
    return accounts;
  };

  getLastIndexedAccount = async (): Promise<any> => {
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
      `${this.executablePath} wallet account deposit-data --storage=${this.storeService.get('keyVaultStorage')} --public-key=${publicKey}`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    const depositData = stdout ? JSON.parse(stdout) : {};
    console.log(depositData);
    return depositData;
  };

  deleteLastIndexedAccount = async (): Promise<void> => {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account delete --storage=${this.storeService.get('keyVaultStorage')}`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    this.storeService.set('keyVaultStorage', stdout.replace('\n', ''));
  };
}
