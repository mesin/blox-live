import got from 'got';
import StoreService from '../store-manager/store.service';
import ServerService from './server.service';
import { step } from '../decorators';

export default class KeyVaultService {
  private readonly storeService: StoreService;
  private readonly serverService: ServerService;

  constructor(storePrefix: string = '') {
    this.storeService = new StoreService(storePrefix);
    this.serverService = new ServerService();
  }

  @step({
    name: 'Run docker container'
  })
  async runDockerContainer(): Promise<void> {
    const ssh = await this.serverService.getConnection();
    const { stdout } = await ssh.execCommand('docker ps -a | grep bloxstaking', {});
    const runAlready = stdout.includes('bloxstaking') && !stdout.includes('Exited');
    if (runAlready) return;
    const { body: keyVaultVersion } = await got.get('https://api.stage.bloxstaking.com/key-vault/latest-tag');
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
      await got.post(`http://${this.storeService.get('publicIp')}:8200/v1/ethereum/storage`, {
        headers: {
          'Authorization': `Bearer ${this.storeService.get('vaultRootToken')}`
        },
        body: {
          // @ts-ignore
          data: storage
        },
        // @ts-ignore
        json: true
      });
    } catch (error) {
      throw new Error(`Vault plugin api error: ${error}`);
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
      await got.get(
        `http://${this.storeService.get('publicIp')}:8200/v1/sys/health`,
        {
          retry: {
            limit: 2,
            calculateDelay: ({ attemptCount, computedValue }) => {
              return +attemptCount < 2 ? computedValue : 0;
            },
          },
          timeout: 5000,
        },
      );
      return { isActive: true };
    } catch (e) {
      console.log(e);
      return { isActive: false };
    }
  }
}
