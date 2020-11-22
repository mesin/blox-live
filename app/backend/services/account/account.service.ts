import Connection from '../../common/store-manager/connection';
import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';
import { Catch, CatchClass, Step } from '../../decorators';
import KeyVaultService from '../key-vault/key-vault.service';
import KeyManagerService from '../key-manager/key-manager.service';
import Web3 from 'web3';
import WalletService from '../wallet/wallet.service';
import config from '../../common/config';

@CatchClass<AccountService>()
export default class AccountService {
  private readonly walletService: WalletService;
  private readonly keyVaultService: KeyVaultService;
  private readonly keyManagerService: KeyManagerService;
  private readonly bloxApi: BloxApi;

  constructor() {
    this.walletService = new WalletService();
    this.keyVaultService = new KeyVaultService();
    this.keyManagerService = new KeyManagerService();
    this.bloxApi = new BloxApi();
    this.bloxApi.init();
  }

  async get() {
    return await this.bloxApi.request(METHOD.GET, 'accounts');
  }

  async create(payload: any) {
    return await this.bloxApi.request(METHOD.POST, 'accounts', payload);
  }

  async delete() {
    return await this.bloxApi.request(METHOD.DELETE, 'accounts');
  }

  async updateStatus(route: string, payload: any) {
    if (!route) {
      throw new Error('route');
    }
    return await this.bloxApi.request(METHOD.PATCH, `accounts/${route}`, payload);
  }

  @Step({
    name: 'Create Blox Account'
  })
  @Catch({
    displayMessage: 'Create Blox Account failed'
  })
  async createBloxAccount(): Promise<any> {
    const network = Connection.db().get('network');
    const index: number = +Connection.db().get(`index.${network}`) + 1;
    const lastIndexedAccount = await this.keyManagerService.getAccount(Connection.db().get('seed'), index);
    lastIndexedAccount.network = network;
    const account = await this.create(lastIndexedAccount);
    if (account.error && account.error instanceof Error) return;
    return { data: account };
  }

  @Step({
    name: 'Create Account'
  })
  @Catch({
    displayMessage: 'CLI Create Account failed'
  })
  async createAccount(): Promise<void> {
    const network = Connection.db().get('network');
    const index: number = await this.getNextIndex();
    const storage = await this.keyManagerService.createAccount(Connection.db().get('seed'), index);
    Connection.db().set(`keyVaultStorage.${network}`, storage);
  }

  async getNextIndex(): Promise<number> {
    const network = Connection.db().get('network');
    if (!network) {
      throw new Error('Configuration settings network not found');
    }
    let index = 0;
    if (Connection.db().exists(`keyVaultStorage.${network}`)) {
      const response = await this.keyVaultService.listAccounts();
      const { data: { accounts } } = response;
      if (accounts && accounts instanceof Array && accounts.length > 0) {
        index = +accounts[0].name.replace('account-', '') + 1;
      }
    }
    Connection.db().set(`index.${network}`, (index - 1).toString());
    return index;
  }

  async listAccounts(): Promise<any> {
    const network = Connection.db().get('network');
    if (!network) {
      throw new Error('Configuration settings network not found');
    }
    return await this.keyManagerService.listAccounts(Connection.db().get(`keyVaultStorage.${network}`));
  }

  async getLastIndexedAccount(): Promise<any> {
    const accounts = await this.listAccounts();
    if (accounts && accounts.length) {
      console.log('account', accounts[0]);
      return accounts[0];
    }
  }

  async getDepositData(pubKey: string, index: number, network: string): Promise<any> {
    if (!network) { // TODO: validate networks
      throw new Error('netwrok is missing');
    }
    if (!pubKey) {
      throw new Error('publicKey is empty');
    }
    const publicKeyWithoutPrefix = pubKey.replace(/^(0x)/, '');
    const depositData = await this.keyManagerService.getDepositData(Connection.db().get('seed'), index, publicKeyWithoutPrefix, network);
    const {
      publicKey,
      withdrawalCredentials,
      signature,
      depositDataRoot,
      depositContractAddress
    } = depositData;

    const depositContractABI = require('./deposit_abi.json');
    const coin = network === config.env.MAINNET_NETWORK ? 'ETH' : 'GoETH';

    const web3 = new Web3(
      'https://goerli.infura.io/v3/d03b92aa81864faeb158166231b7f895'
    );
    const depositContract = new web3.eth.Contract(depositContractABI, depositContractAddress);
    const depositMethod = depositContract.methods.deposit(
      `0x${publicKey}`,
      `0x${withdrawalCredentials}`,
      `0x${signature}`,
      `0x${depositDataRoot}`
    );

    const data = depositMethod.encodeABI();
    return {
      txHash: data,
      network,
      accountIndex: index,
      publicKey,
      depositTo: depositContractAddress,
      coin
    };
  }

  async deleteLastIndexedAccount(): Promise<void> {
    const network = Connection.db().get('network');
    if (!network) {
      throw new Error('Configuration settings network not found');
    }
    const index: number = +Connection.db().get(`index.${network}`);
    const storage = index < 0 ? await this.keyManagerService.createWallet() : await this.keyManagerService.createAccount(Connection.db().get('seed'), index);
    Connection.db().set(`keyVaultStorage.${network}`, storage);
  }

  async generatePublicKeys(): Promise<void> {
    const results = [];
    for (let i = 0; i < 10; i += 1) {
      results.push(this.keyManagerService.generatePublicKey(Connection.db().get('seed'), i));
    }
    await Promise.all(results);
  }

  async deleteAllAccounts(): Promise<void> {
    const keyVaultStorage = Connection.db().get('keyVaultStorage');
    Connection.db().delete('keyVaultStorage');

    if (keyVaultStorage) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [network, storage] of Object.entries(keyVaultStorage)) {
        if (storage) {
          Connection.db().set('network', network);
          // eslint-disable-next-line no-await-in-loop
          await this.walletService.createWallet();
          // eslint-disable-next-line no-await-in-loop
          await this.keyVaultService.updateVaultStorage();
          Connection.db().delete(`index.${network}`);
        }
      }
    }
    await this.delete();
  }

  @Catch({
    showErrorMessage: true
  })
  async recovery({mnemonic, password}: Record<string, any>): Promise<void> {
    const seed = await this.keyManagerService.seedFromMnemonicGenerate(mnemonic);
    const defAccountIndex = 0;
    const accounts = await this.get();
    if (accounts.length === 0) {
      throw new Error('Validators not found');
    }
    const index = accounts[defAccountIndex].name.split('-')[1];
    const storage = await this.keyManagerService.createAccount(seed, index);
    const storageAccounts = await this.keyManagerService.listAccounts(storage);
    const createdAccount = storageAccounts.find(rec => rec.name === `account-${index}`);
    if (createdAccount.validationPubKey !== accounts[defAccountIndex].publicKey.split('x')[1]) {
      throw new Error('Passphrase not linked to your account.');
    }
    Connection.db().clear();
    await Connection.db().setNewPassword(password, false);
    Connection.db().set('seed', seed);
  }
}
