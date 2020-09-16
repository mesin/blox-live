import Store from '../../common/store-manager/store';
import KeyVaultSsh from '../../common/communication-manager/key-vault-ssh';
import VersionService from '../version/version.service';
import { resolveKeyVaultApi, KeyVaultApi } from '../../common/communication-manager/key-vault-api';
import { METHOD } from '../../common/communication-manager/constants';
import { CatchClass, Step } from '../../decorators';

@CatchClass<KeyVaultService>()
export default class KeyVaultService {
  private readonly store: Store;
  private readonly keyVaultSsh: KeyVaultSsh;
  private readonly keyVaultApi: KeyVaultApi;
  private readonly versionService: VersionService;

  constructor(storePrefix: string = '') {
    this.store = Store.getStore(storePrefix);
    this.keyVaultSsh = new KeyVaultSsh(storePrefix);
    this.versionService = new VersionService();
    this.keyVaultApi = resolveKeyVaultApi(storePrefix);
  }

  async updateStorage(payload: any) {
    this.keyVaultApi.init();
    return await this.keyVaultApi.request(METHOD.POST, 'storage', payload);
  }

  async listAccounts() {
    this.keyVaultApi.init();
    return await this.keyVaultApi.request(METHOD.LIST, 'accounts');
  }

  async healthCheck() {
    this.keyVaultApi.init(false);
    return await this.keyVaultApi.request(METHOD.GET, 'sys/health');
  }

  async getVersion() {
    this.keyVaultApi.init(false);
    return await this.keyVaultApi.request(METHOD.GET, 'ethereum/test/version');
  }

  async getSlashingStorage(network: string) {
    if (!network) {
      throw new Error('Configuration settings network not found');
    }
    this.keyVaultApi.init(false);
    return await this.keyVaultApi.request(METHOD.GET, `ethereum/${network}/storage/slashing`);
  }

  async updateSlashingStorage(payload: any, network: string) {
    if (!network) {
      throw new Error('Configuration settings network not found');
    }
    this.keyVaultApi.init(false);
    return await this.keyVaultApi.request(METHOD.POST, `ethereum/${network}storage/slashing`, payload);
  }

  @Step({
    name: 'Installing docker...'
  })
  async installDockerScope(): Promise<void> {
    const ssh = await this.keyVaultSsh.getConnection();
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
    const ssh = await this.keyVaultSsh.getConnection();
    const { stdout: rootToken } = await ssh.execCommand('sudo cat data/keys/vault.root.token', {});
    if (!rootToken) throw new Error('vault-plugin rootToken not found');
    this.store.set('vaultRootToken', rootToken);
  }

  @Step({
    name: 'Running docker container...'
  })
  async runDockerContainer(): Promise<void> {
    const ssh = await this.keyVaultSsh.getConnection();
    const { stdout, stderr } = await ssh.execCommand('docker ps -a | grep bloxstaking', {});
    if (stderr) {
      console.log(stderr);
    }
    const runAlready = stdout.includes('bloxstaking') && !stdout.includes('Exited');
    if (runAlready) return;
    const keyVaultVersion = await this.versionService.getLatestKeyVaultVersion();
    this.store.set('keyVaultVersion', keyVaultVersion);
    await ssh.execCommand(
      `curl -L "${process.env.VAULT_GITHUB_URL}/${keyVaultVersion}/docker-compose.yml" -o docker-compose.yml && UNSEAL=false docker-compose up -d vault-image`,
      {}
    );
  }

  @Step({
    name: 'Running KeyVault...'
  })
  async runScripts(): Promise<void> {
    const ssh = await this.keyVaultSsh.getConnection();
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
    requiredConfig: ['publicIp', 'vaultRootToken', 'keyVaultStorage', 'network']
  })
  async updateVaultStorage(): Promise<void> {
    const network = this.store.get('network');
    await this.updateStorage({ data: this.store.get(`keyVaultStorage.${network}`) });
  }

  @Step({
    name: 'Updating server storage...',
    requiredConfig: ['publicIp', 'vaultRootToken', 'keyVaultStorage']
  })
  async updateVaultMountsStorage(): Promise<void> {
    // TODO get from env
    const networks = ['test', 'launchtest'];

    for (const network of networks) {
      const storage = this.store.get(`keyVaultStorage.${network}`);
      if (storage) {
        this.store.set('network', network);
        await this.updateStorage({ data: storage });
      }
    }
  }

  @Step({
    name: 'Export slashing protection data...',
    requiredConfig: ['publicIp', 'vaultRootToken']
  })
  async exportSlashingData(): Promise<any> {
    // TODO get from env
    const networks = ['test', 'launchtest'];

    for (const network of networks) {
      const slashingData = await this.getSlashingStorage(network);
      if (slashingData) {
        this.store.set(`slashingData.${network}`, slashingData.data);
      }
    }
  }

  @Step({
    name: 'Import slashing protection data...',
    requiredConfig: ['publicIp', 'vaultRootToken', 'slashingData']
  })
  async importSlashingData(): Promise<any> {
    // TODO get from env
    const networks = ['test', 'launchtest'];

    for (const network of networks) {
      const slashingData = this.store.get(`slashingData.${network}`);
      if (slashingData) {
        await this.updateSlashingStorage(slashingData, network);
      }
    }
  }

  @Step({
    name: 'Validating KeyVault final configuration...',
    requiredConfig: ['publicIp', 'vaultRootToken']
  })
  async getKeyVaultStatus() {
    // check if the key vault is alive
    await new Promise((resolve) => setTimeout(resolve, 5000));
    try {
      await this.getVersion();
      return { isActive: true };
    } catch (e) {
      console.log(e);
      return { isActive: false };
    }
  }
}
