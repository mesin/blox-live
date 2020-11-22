import Connection from '../../common/store-manager/connection';
import KeyVaultSsh from '../../common/communication-manager/key-vault-ssh';
import VersionService from '../version/version.service';
import WalletService from '../wallet/wallet.service';
import KeyVaultApi from '../../common/communication-manager/key-vault-api';
import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';
import { CatchClass, Step } from '../../decorators';
import config from '../../common/config';

const STABLE_TAG = 'v0.1.13';

function numVal(str) {
  return +str.replace(/\D/g, '');
}

function sleep(msec) {
  return new Promise(resolve => {
    setTimeout(resolve, msec);
  });
}

@CatchClass<KeyVaultService>()
export default class KeyVaultService {
  private readonly keyVaultSsh: KeyVaultSsh;
  private readonly keyVaultApi: KeyVaultApi;
  private readonly versionService: VersionService;
  private readonly walletService: WalletService;
  private readonly bloxApi: BloxApi;
  private storePrefix: string;

  constructor(prefix: string = '') {
    this.storePrefix = prefix;
    this.keyVaultSsh = new KeyVaultSsh(this.storePrefix);
    this.versionService = new VersionService();
    this.keyVaultApi = new KeyVaultApi(this.storePrefix);
    this.walletService = new WalletService(this.storePrefix);
    this.bloxApi = new BloxApi();
    this.bloxApi.init();
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
    return await this.keyVaultApi.request(METHOD.GET, `ethereum/${config.env.TEST_NETWORK}/version`);
  }

  async getSlashingStorage(network: string) {
    if (!network) {
      throw new Error('Configuration settings network not found');
    }
    this.keyVaultApi.init(false);
    return await this.keyVaultApi.request(METHOD.GET, `ethereum/${network}/storage/slashing`);
  }

  async getContainerId() {
    const ssh = await this.keyVaultSsh.getConnection();
    const { stdout: containerId, stderr: error } = await ssh.execCommand('docker ps -aq -f "status=running" -f "name=key_vault"', {});
    if (error) {
      throw new Error('Could not reach Docker Container');
    }
    return containerId;
  }

  async updateSlashingStorage(payload: any, network: string) {
    if (!network) {
      throw new Error('Configuration settings network not found');
    }
    this.keyVaultApi.init(false);
    return await this.keyVaultApi.request(METHOD.POST, `ethereum/${network}/storage/slashing`, payload);
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
  }

  @Step({
    name: 'Getting KeyVault authentication token...'
  })
  async getKeyVaultRootToken(): Promise<void> {
    const ssh = await this.keyVaultSsh.getConnection();
    const { stdout: rootToken } = await ssh.execCommand('sudo cat data/keys/vault.root.token', {});
    if (!rootToken) throw new Error('vault-plugin rootToken not found');
    Connection.db(this.storePrefix).set('vaultRootToken', rootToken);
  }

  @Step({
    name: 'Running docker container...'
  })
  async runDockerContainer(): Promise<void> {
    const containerId = await this.getContainerId();
    if (containerId) {
      return;
    }

    const keyVaultVersion = await this.versionService.getLatestKeyVaultVersion();
    const envKey = (Connection.db(this.storePrefix).get('env') || 'production');
    const dockerHubImage = envKey === 'production' ?
      `bloxstaking/key-vault:${keyVaultVersion}` :
      `bloxstaking/key-vault-rc:${keyVaultVersion}`;

    const networksList = await this.bloxApi.request(METHOD.GET, 'ethereum2/genesis-time');

    let dockerCMD = 'docker start key_vault 2>/dev/null || ' +
      `docker pull  ${dockerHubImage} && docker run -d --restart unless-stopped --cap-add=IPC_LOCK --name=key_vault ` +
      '-v $(pwd)/data:/data ' +
      '-v $(pwd)/policies:/policies ' +
      '-p 8200:8200 ' +
      '-e UNSEAL=true ' +
      "-e VAULT_ADDR='http://127.0.0.1:8200' " +
      "-e VAULT_API_ADDR='http://127.0.0.1:8200' " +
      "-e VAULT_CLIENT_TIMEOUT='30s' ";

    if (typeof networksList === 'object') {
      Object.entries(networksList).forEach(([key, val]) => {
        if (key !== 'test') {
          dockerCMD += `-e ${key.toUpperCase()}_GENESIS_TIME='${val}' `;
        }
      });
    }
    dockerCMD += `'${dockerHubImage}'`;

    const ssh = await this.keyVaultSsh.getConnection();
    const { stderr: error } = await ssh.execCommand(
      dockerCMD,
      {}
    );

    Connection.db(this.storePrefix).set('keyVaultVersion', keyVaultVersion);

    await sleep(12000);

    if (error) {
      throw new Error('Failed to run Key Vault docker container');
    }
  }

  @Step({
    name: 'Updating server storage...'
  })
  async updateVaultStorage(): Promise<void> {
    const network = Connection.db(this.storePrefix).get('network');
    await this.updateStorage({ data: Connection.db(this.storePrefix).get(`keyVaultStorage.${network}`) });
  }

  @Step({
    name: 'Updating server storage...'
  })
  async updateVaultMountsStorage(): Promise<void> {
    const keyVaultStorage = Connection.db(this.storePrefix).get('keyVaultStorage');

    if (keyVaultStorage) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [network, storage] of Object.entries(keyVaultStorage)) {
        if (storage) {
          Connection.db(this.storePrefix).set('network', network);
          // eslint-disable-next-line no-await-in-loop
          await this.updateVaultStorage();
        }
      }
    }
  }

  @Step({
    name: 'Export slashing protection data...'
  })
  async importSlashingData(): Promise<any> {
    const keyVaultStorage = Connection.db(this.storePrefix).get('keyVaultStorage');
    // check if kv version higher or equal stable tag
    const currentVersion = (await this.getVersion()).data.version;
    if (numVal(currentVersion) < numVal(STABLE_TAG)) {
      return;
    }
    if (keyVaultStorage) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [network, storage] of Object.entries(keyVaultStorage)) {
        if (storage) {
          // eslint-disable-next-line no-await-in-loop
          const slashingData = await this.getSlashingStorage(network);
          if (Object.keys(slashingData.data).length) {
            Connection.db(this.storePrefix).set(`slashingData.${network}`, slashingData.data);
          }
        }
      }
    }
  }

  @Step({
    name: 'Import slashing protection data...'
  })
  async exportSlashingData(): Promise<any> {
    const slashingData = Connection.db(this.storePrefix).get('slashingData');
    // check if kv version higher or equal stable tag
    const currentVersion = (await this.getVersion()).data.version;
    if (numVal(currentVersion) < numVal(STABLE_TAG)) {
      return;
    }

    if (slashingData) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [network, storage] of Object.entries(slashingData)) {
        if (storage) {
          // eslint-disable-next-line no-await-in-loop
          await this.updateSlashingStorage(storage, network);
        }
      }
    }
  }

  @Step({
    name: 'Validating KeyVault final configuration...'
  })
  async getKeyVaultStatus() {
    // check if the key vault is alive
    await new Promise((resolve) => setTimeout(resolve, 5000));
    try {
      await this.getVersion();
      const { status } = await this.walletService.health();
      if (status !== 'active') {
        throw new Error('wallet health check: status is not active');
      }
      return { isActive: true };
    } catch (e) {
      console.log(e);
      return { isActive: false };
    }
  }
}
