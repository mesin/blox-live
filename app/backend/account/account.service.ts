import StoreService from '../store-manager/store.service';
import ServerService from '../key-vault/server.service';
import AccountKeyVaultService from '../account/account-key-vault.service';
import BloxApiService from '../communication-manager/blox-api.service';
import { step } from '../decorators';

// TODO import from .env
const tempStorePrefix = 'tmp';

export default class AccountService {
  private readonly storeService: StoreService;
  private readonly serverService: ServerService;
  private readonly accountKeyVaultService: AccountKeyVaultService;
  private readonly bloxApiService: BloxApiService;

  constructor(storePrefix: string = '') {
    this.storeService = new StoreService(storePrefix);
    this.serverService = new ServerService();
    this.accountKeyVaultService = new AccountKeyVaultService();
    this.bloxApiService = new BloxApiService();
  }

  get = async () => {
    return await this.bloxApiService.request('GET', 'accounts');
  };

  delete = async () => {
    return await this.bloxApiService.request('DELETE', 'accounts');
  };

  updateStatus = async (route: string, payload: any) => {
    if (!route) {
      throw new Error('route')
    }
    return await this.bloxApiService.request('PATCH', `accounts/${route}`, payload);
  };

  @step({
    name: 'Get key vault root token',
    requiredConfig: ['publicIp']
  })
  async getKeyVaultRootToken(): Promise<void> {
    const ssh = await this.serverService.getConnection();
    const { stdout: rootToken } = await ssh.execCommand('sudo cat data/keys/vault.root.token', {});
    if (!rootToken) throw new Error('root vault-plugin key not found');
    this.storeService.set('vaultRootToken', rootToken);
  }

  @step({
    name: 'Sync vault with blox api',
    requiredConfig: ['publicIp', 'authToken', 'vaultRootToken']
  })
  async syncVaultWithBlox(): Promise<void> {
    const ssh = await this.serverService.getConnection();
    const { stdout: statusCode, stderr } = await ssh.execCommand(
      `curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --header "Authorization: Bearer ${this.storeService.get('authToken')}" --request POST --data '{"url": "http://${this.storeService.get('publicIp')}:8200", "accessToken": "${this.storeService.get('vaultRootToken')}"}' https://api.stage.bloxstaking.com/wallets/sync`,
      {}
    );
    if (+statusCode > 201) {
      throw new Error(`Blox Staking api error: ${statusCode} ${stderr}`);
    }
  }

  @step({
    name: 'Resync vault with blox api',
    requiredConfig: ['publicIp', 'authToken', 'vaultRootToken']
  })
  async resyncNewVaultWithBlox(): Promise<void> {
    const ssh = await this.serverService.getConnection();
    const { stdout: statusCode, stderr } = await ssh.execCommand(
      `curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --header "Authorization: Bearer ${this.storeService.get('authToken')}" --request PATCH --data '{"url": "http://${this.storeService.get('publicIp')}:8200", "accessToken": "${this.storeService.get('vaultRootToken')}"}' https://api.stage.bloxstaking.com/wallets/sync`,
      {}
    );
    if (+statusCode > 201) {
      throw new Error(`Blox Staking api error: ${statusCode} ${stderr}`);
    }
  }

  @step({
    name: 'Remove blox staking account',
    requiredConfig: ['authToken']
  })
  async deleteBloxAccount(): Promise<void> {
    const ssh = await this.serverService.getConnection();
    const { stdout: statusCode, stderr } = await ssh.execCommand(
      `curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --header "Authorization: Bearer ${this.storeService.get('authToken')}" --request DELETE https://api.stage.bloxstaking.com/organizations`,
      {}
    );
    console.log(statusCode, stderr);
    if (+statusCode > 201) {
      console.log(`Blox Staking api error: ${statusCode} ${stderr}`);
    }
  }

  @step({
    name: 'Remove Blox Accounts',
    requiredConfig: ['authToken']
  })
  async deleteBloxAccounts(): Promise<void> {
    try {
      await this.delete();
      this.storeService.delete('keyVaultStorage');
    } catch (error) {
      throw new Error(`STEP: Remove Blox Accounts step error: ${error}`);
    }
  }

  @step({
    name: 'Create Blox Account',
    requiredConfig: ['authToken']
  })
  async createBloxAccount(): Promise<any> {
    const lastIndexedAccount = await this.accountKeyVaultService.getLastIndexedAccount();
    if (!lastIndexedAccount) {
      throw new Error(`No account to create`);
    }
    try {
      const response = await this.bloxApiService.request('POST', 'accounts', lastIndexedAccount);
      return { data: response };
    } catch (error) {
      throw new Error(`STEP: Create Blox Account error: ${error}`);
    }
  }

  @step({
    name: 'Prepare tmp storage'
  })
  prepareTmpStorageConfig(): void {
    const tmpStoreService = new StoreService(tempStorePrefix);
    tmpStoreService.setMultiple({
      uuid: this.storeService.get('uuid'),
      authToken: this.storeService.get('authToken'),
      credentials: this.storeService.get('credentials'),
      keyPair: this.storeService.get('keyPair'),
      securityGroupId: this.storeService.get('securityGroupId'),
      keyVaultStorage: this.storeService.get('keyVaultStorage')
    });
  }

  @step({
    name: 'Store tmp config into main'
  })
  saveTmpConfigIntoMain(): void {
    const tmpStoreService = new StoreService(tempStorePrefix);
    tmpStoreService.setMultiple({
      uuid: tmpStoreService.get('uuid'),
      authToken: tmpStoreService.get('authToken'),
      addressId: tmpStoreService.get('addressId'),
      publicIp: tmpStoreService.get('publicIp'),
      instanceId: tmpStoreService.get('instanceId'),
      vaultRootToken: tmpStoreService.get('vaultRootToken'),
      keyVaultVersion: tmpStoreService.get('keyVaultVersion'),
      keyVaultStorage: tmpStoreService.get('keyVaultStorage')
    });
    tmpStoreService.clear();
  }
}
