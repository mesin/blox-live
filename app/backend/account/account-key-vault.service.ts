import Configstore from 'configstore';
import KeyVaultCliService from '../key-vault/key-vault-cli.service';
import { step } from '../decorators';


export default class AccountKeyVaultService extends KeyVaultCliService {
  private readonly conf: Configstore;

  constructor(storeName: string) {
    super();
    this.conf = new Configstore(storeName);
  }

  @step({
    name: 'Create Wallet'
  })
  async createWallet(): Promise<void> {
    if (this.conf.get('key-vault-storage'))
      return;
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet create`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    this.conf.set('key-vault-storage', stdout.replace('\n', ''));
  }

  @step({
    name: 'Create Account',
    requiredConfig: ['seed', 'key-vault-storage']
  })
  async createAccount(): Promise<void> {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account create --seed=${this.conf.get('seed')} --storage=${this.conf.get('key-vault-storage')}`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    this.conf.set('key-vault-storage', stdout.replace('\n', ''));
  }
}
