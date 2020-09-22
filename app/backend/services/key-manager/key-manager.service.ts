import Store from '../../common/store-manager/store';
import { CatchClass } from '../../decorators';
import util from 'util';
import { exec } from 'child_process';
import { execPath } from '../../../binaries';

@CatchClass<KeyManagerService>()
export default class KeyManagerService {
  private readonly executablePath: string;
  private readonly executor: (command: string) => Promise<any>;
  private readonly store: Store;

  constructor() {
    this.executor = util.promisify(exec);
    this.executablePath = execPath;
    this.store = Store.getStore();
  }

  async createWallet(): Promise<string> {
    const { stdout, stderr } = await this.executor(`${this.executablePath} wallet create`);
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    return stdout.replace('\n', '');
  }

  async createAccount(seed: string, storage: string): Promise<string> {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account create --seed=${seed} --storage=${storage}`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    return stdout.replace('\n', '');
  }

  async listAccounts(storage: string): Promise<any> {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account list --storage=${storage}`
    );
    if (stderr) {
      throw new Error(`Get last created account error: ${stderr}`);
    }
    const accounts = stdout ? JSON.parse(stdout) : [];
    console.log(accounts);
    return accounts;
  }

  async getDepositData(publicKey: string, network: string): Promise<any> {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account deposit-data --storage=${this.store.get(`keyVaultStorage.${network}`)} --public-key=${publicKey} --network=${network}`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    return stdout ? JSON.parse(stdout) : {};
  }

  async deleteLastIndexedAccount(storage: string): Promise<string> {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account delete --storage=${storage}`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    return stdout.replace('\n', '');
  }

  async generatePublicKey(seed: string, index: number): Promise<void> {
    const { stdout, stderr } = await this.executor(`${this.executablePath} wallet public-key generate --seed=${seed} --index=${index}`);
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
  }

  async mnemonicGenerate(): Promise<string> {
    const { stdout, stderr } = await this.executor(`${this.executablePath} mnemonic generate`);
    if (stderr) {
      throw new Error(stderr);
    }
    console.log(stdout);
    return stdout.replace('\n', '');
  }

  async seedFromMnemonicGenerate(mnemonic: string): Promise<string> {
    if (!mnemonic || mnemonic.length === 0) {
      throw new Error('mnemonic phrase is empty');
    }
    const { stdout, stderr } = await this.executor(`${this.executablePath} seed generate --mnemonic="${mnemonic}"`);
    if (stderr) {
      throw new Error(stderr);
    }
    return stdout.replace('\n', '');
  }
}