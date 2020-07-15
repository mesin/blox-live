import Configstore from 'configstore';
import FlowLib from './flow';
import NodeSSH from 'node-ssh';
import chalk from 'chalk';

export default class KeyVaultLib {
  public readonly conf: Configstore;
  public readonly flow: FlowLib;

  constructor(storeName: string) {
    this.conf = new Configstore(storeName);
    this.flow = new FlowLib(storeName);
  }

  async connectToServer(): Promise<NodeSSH> {
    this.flow.validate('publicIp');
    this.flow.validate('keyPair');
    const ssh = new NodeSSH();
    await ssh.connect({
      host: this.conf.get('publicIp'),
      username: 'ec2-user',
      privateKey: this.conf.get('keyPair').privateKey,
    });
    return ssh;
  }

  async installDockerScope(): Promise<void> {
    const ssh = await this.connectToServer();
    const { stdout } = await ssh.execCommand('docker -v', {});
    const installedAlready = stdout.includes('version');
    if (installedAlready) return;

    await ssh.execCommand('sudo yum update -y', {});
    await ssh.execCommand('sudo yum install docker -y', {});
    await ssh.execCommand('sudo service docker start', {});
    await ssh.execCommand('sudo usermod -a -G docker ec2-user', {});
    await ssh.execCommand(
      'sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose',
      {},
    );
  }

  async runDockerValut(): Promise<void> {
    const ssh = await this.connectToServer();
    const { stdout } = await ssh.execCommand('docker ps -a | grep bloxstaking', {});
    const runAlready = stdout.includes('bloxstaking') && !stdout.includes('Exited');
    if (runAlready) return;

    await ssh.execCommand(
      `curl -L "https://raw.githubusercontent.com/bloxapp/vault-plugin-secrets-eth2.0/v0.0.10/docker-compose.yml" -o docker-compose.yml && UNSEAL=false docker-compose up -d vault-image`,
      {},
    );
    // await this.flow.delay(30000);
  }

  async runKeyVaultScripts(): Promise<void> {
    const ssh = await this.connectToServer();
    const { stdout: containerId } = await ssh.execCommand('docker ps -aq -f "status=running" -f "name=vault"', {});
    if (!containerId) {
      throw new Error('Key Vault docker container not found');
    }
    const { stderr } = await ssh.execCommand(
      `docker exec -t ${containerId} sh -c "/bin/sh /vault/config/vault-init.sh; /bin/sh /vault/config/vault-unseal.sh; /bin/sh /vault/config/vault-plugin.sh"`,
      {},
    );
    if (stderr) {
      throw new Error(`Key Vault entrypoint scripts are failed: ${stderr}`);
    }
  }

  async syncVaultWithBlox(): Promise<void> {
    this.flow.validate('otp');
    this.flow.validate('publicIp');
    const ssh = await this.connectToServer();
    const { stdout: rootToken } = await ssh.execCommand('sudo cat data/keys/vault.root.token', {});
    if (!rootToken) throw new Error('root vault-plugin key not found');
    this.conf.set('vaultRootToken', rootToken);
    const { stdout: statusCode, stderr } = await ssh.execCommand(
      `curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --request POST --data '{"otp": "${this.conf.get(
        'otp',
      )}", "url": "http://${this.conf.get(
        'publicIp',
      )}:8200", "accessToken": "${rootToken}"}' http://api.stage.bloxstaking.com/wallets/root`,
      {},
    );
    if (+statusCode > 201) {
      throw new Error(`Blox Staking api error: ${statusCode} ${stderr}`);
    }
  }

  async resyncNewVaultWithBlox(): Promise<void> {
    this.flow.validate('otp');
    this.flow.validate('publicIp');
    const ssh = await this.connectToServer();
    const { stdout: rootToken } = await ssh.execCommand('sudo cat data/keys/vault.root.token', {});
    if (!rootToken) throw new Error('root vault-plugin key not found');
    this.conf.set('vaultRootToken', rootToken);
    const { stdout: statusCode, stderr } = await ssh.execCommand(
      `curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --request PATCH --data '{"otp": "${this.conf.get(
        'otp',
      )}", "url": "http://${this.conf.get(
        'publicIp',
      )}:8200", "accessToken": "${rootToken}"}' http://api.stage.bloxstaking.com/wallets/root`,
      {},
    );
    if (+statusCode > 201) {
      throw new Error(`Blox Staking api error: ${statusCode} ${stderr}`);
    }
  }

  async deleteBloxAccount(): Promise<void> {
    this.flow.validate('otp');
    const ssh = await this.connectToServer();
    const { stdout: statusCode, stderr } = await ssh.execCommand(
      `curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --request DELETE http://api.stage.bloxstaking.com/organizations/otp/${this.conf.get(
        'otp',
      )}`,
      {},
    );
    if (+statusCode > 201) {
      console.log(chalk.red(`Blox Staking api error: ${statusCode} ${stderr}`));
    }
  }

  async install(): Promise<void> {
    const scopeKey = 'install.keyVault';
    const flowSteps = [
      {
        name: 'Connect to the server by ssh',
        func: this.connectToServer,
      },
      {
        name: 'Install docker and docker-compose',
        func: this.installDockerScope,
      },
      {
        name: 'Run vault plugin docker container',
        func: this.runDockerValut,
      },
      {
        name: 'Run key vault setup scripts',
        func: this.runKeyVaultScripts,
      },
      {
        name: 'Sync blox staking with vault plugin container',
        func: this.syncVaultWithBlox,
      },
      {
        func: () => {
          this.conf.set(`${scopeKey}.done`, true);
        },
      },
    ];
    await this.flow.run(this, flowSteps, scopeKey);
  }

  async uninstall(): Promise<void> {
    const scopeKey = 'uninstall.keyVault';
    const flowSteps = [
      {
        name: 'Connect to the server by ssh',
        func: this.connectToServer,
      },
      {
        name: 'Delete blox staking account',
        func: this.deleteBloxAccount,
      },
      {
        func: () => {
          this.conf.set(`${scopeKey}.done`, true);
        },
      },
    ];
    await this.flow.run(this, flowSteps, scopeKey);
  }

  async reinstall(): Promise<void> {
    const scopeKey = 'reinstall.keyVault';
    const flowSteps = [
      {
        name: 'Connect to the server by ssh',
        func: this.connectToServer,
      },
      {
        name: 'Install docker and docker-compose',
        func: this.installDockerScope,
      },
      {
        name: 'Run vault plugin docker container',
        func: this.runDockerValut,
      },
      {
        name: 'Run key vault setup scripts',
        func: this.runKeyVaultScripts,
      },
      {
        name: 'Resync blox staking with new vault plugin container',
        func: this.resyncNewVaultWithBlox,
      },
      {
        func: () => {
          this.conf.set(`${scopeKey}.done`, true);
        },
      },
    ];
    await this.flow.run(this, flowSteps, scopeKey);
  }
}
