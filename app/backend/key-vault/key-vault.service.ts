import { StoreService, resolveStoreService } from '../store-manager/store.service';
import KeyVaultSshService from '../communication-manager/key-vault-ssh.service';
import AccountService from '../account/account.service';
import { resolveKeyVaultApiService, KeyVaultApiService } from '../communication-manager/key-vault-api.service';
import { METHOD } from '../communication-manager/constants';
import { CatchClass, Step } from '../decorators';

@CatchClass<KeyVaultService>()
export default class KeyVaultService {
  private readonly storeService: StoreService;
  private readonly keyVaultSshService: KeyVaultSshService;
  private readonly accountService: AccountService;
  private readonly keyVaultApiService: KeyVaultApiService;

  constructor(storePrefix: string = '') {
    this.storeService = resolveStoreService(storePrefix);
    this.keyVaultSshService = new KeyVaultSshService(storePrefix);
    this.accountService = new AccountService(storePrefix);
    this.keyVaultApiService = resolveKeyVaultApiService(storePrefix);
  }

  updateStorage = async (payload: any) => {
    this.keyVaultApiService.init();
    return await this.keyVaultApiService.request(METHOD.POST, 'ethereum/storage', payload);
  };

  listAccounts = async () => {
    this.keyVaultApiService.init();
    return await this.keyVaultApiService.request(METHOD.LIST, 'ethereum/accounts');
  };

  healthCheck = async () => {
    this.keyVaultApiService.init();
    return await this.keyVaultApiService.request(METHOD.GET, 'sys/health');
  };

  @Step({
    name: 'Installing docker...'
  })
  async installDockerScope(): Promise<void> {
    const ssh = await this.keyVaultSshService.getConnection();
    const { stdout } = await ssh.execCommand('docker -v', {});
    const installedAlready = stdout.includes('version');
    if (installedAlready) return;

    await ssh.execCommand('sudo yum update -y', {});
    await ssh.execCommand('sudo yum install docker -y', {});
    await ssh.execCommand('sudo service docker start', {});
    await ssh.execCommand('sudo usermod -a -G docker ec2-user', {});
    await ssh.execCommand(
      'sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose',
      {}
    );
  }

  @Step({
    name: 'Getting KeyVault authentication token...',
    requiredConfig: ['publicIp']
  })
  async getKeyVaultRootToken(): Promise<void> {
    const ssh = await this.keyVaultSshService.getConnection();
    const { stdout: rootToken } = await ssh.execCommand('sudo cat data/keys/vault.root.token', {});
    if (!rootToken) throw new Error('vault-plugin rootToken not found');
    this.storeService.set('vaultRootToken', rootToken);
  }

  @Step({
    name: 'Running docker container...'
  })
  async runDockerContainer(): Promise<void> {
    const ssh = await this.keyVaultSshService.getConnection();
    const { stdout, stderr } = await ssh.execCommand('docker ps -a | grep bloxstaking', {});
    if (stderr) {
      console.log(stderr);
    }
    const runAlready = stdout.includes('bloxstaking') && !stdout.includes('Exited');
    if (runAlready) return;
    const keyVaultVersion = await this.accountService.getLatestTag();
    this.storeService.set('keyVaultVersion', keyVaultVersion);
    await ssh.execCommand(
      `curl -L "${process.env.VAULT_GITHUB_URL}/${keyVaultVersion}/docker-compose.yml" -o docker-compose.yml && UNSEAL=false docker-compose up -d vault-image`,
      {}
    );
  }

  @Step({
    name: 'Running KeyVault...'
  })
  async runScripts(): Promise<void> {
    const ssh = await this.keyVaultSshService.getConnection();
    const { stdout: containerId, stderr: error } = await ssh.execCommand('docker ps -aq -f "status=running" -f "name=vault"', {});
    if (error) {
      console.log(error);
    }
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

  @Step({
    name: 'Updating server storage...',
    requiredConfig: ['publicIp', 'vaultRootToken', 'keyVaultStorage']
  })
  async updateVaultStorage(): Promise<void> {
    await this.updateStorage({ data: this.storeService.get('keyVaultStorage') });
  }

  @Step({
    name: 'Validating KeyVault final configuration...',
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
