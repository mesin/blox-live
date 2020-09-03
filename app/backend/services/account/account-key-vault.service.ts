import KeyVaultCli from '../../common/communication-manager/key-vault-cli';
import { store, Store } from '../../common/store-manager/store';
import Web3 from 'web3';
import { Catch, CatchClass, Step } from '../../decorators';

@CatchClass<AccountKeyVaultService>()
export default class AccountKeyVaultService extends KeyVaultCli {
  private readonly store: Store;

  constructor() {
    super();
    this.store = store;
  }

  @Step({
    name: 'Creating wallet...'
  })
  @Catch({
    displayMessage: 'CLI Create Wallet failed'
  })
  async createWallet(): Promise<void> {
    if (this.store.get('keyVaultStorage')) return;
    const { stdout, stderr } = await this.executor(`${this.executablePath} wallet create`);
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    this.store.set('keyVaultStorage', stdout.replace('\n', ''));
  }

  @Step({
    name: 'Create Account',
    requiredConfig: ['seed', 'keyVaultStorage']
  })
  @Catch({
    displayMessage: 'CLI Create Account failed'
  })
  async createAccount(): Promise<void> {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account create --seed=${this.store.get('seed')} --storage=${this.store.get('keyVaultStorage')}`
    );
    if (stderr) {
      throw new Error(`Create account error: ${stderr}`);
    }
    console.log(stdout);
    this.store.set('keyVaultStorage', stdout.replace('\n', ''));
  }

  async listAccounts(): Promise<any> {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account list --storage=${this.store.get('keyVaultStorage')}`
    );
    if (stderr) {
      throw new Error(`Get last created account error: ${stderr}`);
    }
    const accounts = stdout ? JSON.parse(stdout) : [];
    console.log(accounts);
    return accounts;
  }

  async getLastIndexedAccount(): Promise<any> {
    const accounts = await this.listAccounts();
    if (accounts.length) {
      console.log('account', accounts[0]);
      return accounts[0];
    }
  }

  async getDepositData(pubKey: string): Promise<any> {
    if (!pubKey) {
      throw new Error('publicKey is empty');
    }
    const publicKeyWithoutPrefix = pubKey.replace(/^(0x)/, '');
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account deposit-data --storage=${this.store.get('keyVaultStorage')} --public-key=${publicKeyWithoutPrefix}`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    const depositData = stdout ? JSON.parse(stdout) : {};
    const {
      publicKey,
      withdrawalCredentials,
      signature,
      depositDataRoot
    } = depositData;

    const depositContractABI = require('./deposit_abi.json');
    const depositTo = '0x07b39F4fDE4A38bACe212b546dAc87C58DfE3fDC';
    const web3 = new Web3(
      'https://goerli.infura.io/v3/d03b92aa81864faeb158166231b7f895'
    );
    const depositContract = new web3.eth.Contract(depositContractABI, depositTo);
    const depositMethod = depositContract.methods.deposit(
      `0x${publicKey}`,
      `0x${withdrawalCredentials}`,
      `0x${signature}`,
      `0x${depositDataRoot}`
    );

    const data = depositMethod.encodeABI();
    console.log(data);
    return data;
  }

  async deleteLastIndexedAccount(): Promise<void> {
    const { stdout, stderr } = await this.executor(
      `${this.executablePath} wallet account delete --storage=${this.store.get('keyVaultStorage')}`
    );
    if (stderr) {
      throw new Error(`Cli error: ${stderr}`);
    }
    console.log(stdout);
    this.store.set('keyVaultStorage', stdout.replace('\n', ''));
  }
}
