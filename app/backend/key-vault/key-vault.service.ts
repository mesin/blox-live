import StoreService from '../store-manager/store.service';
import ServerService from './server.service';
import KeyVaultApiService from '../communication-manager/key-vault-api.service';
import { step } from '../decorators';
import AccountService from '../account/account.service';

export default class KeyVaultService {
  private readonly storeService: StoreService;
  private readonly serverService: ServerService;
  private readonly accountService: AccountService;
  private readonly keyVaultApiService: KeyVaultApiService;

  constructor(storePrefix: string = '') {
    this.storeService = new StoreService(storePrefix);
    this.serverService = new ServerService();
    this.accountService = new AccountService();
    this.keyVaultApiService = new KeyVaultApiService();
  }

  updateStorage = async (payload: any) => {
    return await this.keyVaultApiService.request('POST', 'ethereum/storage', payload);
  };

  healthCheck = async () => {
    return await this.keyVaultApiService.request('GET', 'sys/health');
  };

  @step({
    name: 'Run docker container'
  })
  async runDockerContainer(): Promise<void> {
    const ssh = await this.serverService.getConnection();
    const { stdout } = await ssh.execCommand('docker ps -a | grep bloxstaking', {});
    const runAlready = stdout.includes('bloxstaking') && !stdout.includes('Exited');
    if (runAlready) return;
    const keyVaultVersion = await this.accountService.getLatestTag();
    this.storeService.set('keyVaultVersion', keyVaultVersion);
    await ssh.execCommand(
      `curl -L "https://raw.githubusercontent.com/bloxapp/vault-plugin-secrets-eth2.0/${keyVaultVersion}/docker-compose.yml" -o docker-compose.yml && UNSEAL=false docker-compose up -d vault-image`,
      {}
    );
  }

  @step({
    name: 'Run key vault scripts'
  })
  async runScripts(): Promise<void> {
    const ssh = await this.serverService.getConnection();
    const { stdout: containerId } = await ssh.execCommand('docker ps -aq -f "status=running" -f "name=vault"', {});
    if (!containerId) {
      throw new Error('Key Vault docker container not found');
    }
    const { stderr } = await ssh.execCommand(
      `docker exec -t ${containerId} sh -c "/bin/sh /vault/config/vault-init.sh; /bin/sh /vault/config/vault-unseal.sh; /bin/sh /vault/config/vault-plugin.sh"`,
      {}
    );
    if (stderr) {
      throw new Error(`Key Vault entrypoint scripts are failed: ${stderr}`);
    }
  }

  @step({
    name: 'Update Storage',
    requiredConfig: ['publicIp', 'vaultRootToken', 'keyVaultStorage']
  })
  async updateVaultStorage(): Promise<void> {
    try {
      const storage = this.storeService.get('keyVaultStorage');
      await this.updateStorage({ data: storage });
    } catch (error) {
      throw new Error(`STEP: Update Storage error: ${error}`);
    }
  }

  @step({
    name: 'Get key vault status',
    requiredConfig: ['publicIp']
  })
  async getKeyVaultStatus() {
    // check if the key vault is alive
    await new Promise((resolve) => setTimeout(resolve, 5000));
    try {
      await this.healthCheck();
      return { isActive: true };
    } catch (e) {
      console.log(e);
      return { isActive: false };
    }
  }
}
