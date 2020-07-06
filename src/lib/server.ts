
import Configstore from 'configstore';
import FlowLib from './flow';
import NodeSSH from 'node-ssh';
import chalk from 'chalk';

export default class ServerLib {
  public readonly conf: Configstore = new Configstore('blox-infra');
  public readonly flow: FlowLib = new FlowLib();

  async connectToServer(): Promise<NodeSSH> {
    this.flow.validate('publicIp');
    this.flow.validate('keyPair');
    const ssh = new NodeSSH();
    await ssh.connect({
      host: this.conf.get('publicIp'),
      username: 'ec2-user',
      privateKey: this.conf.get('keyPair').privateKey
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
    await ssh.execCommand('sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose', {});
  }

  async runDockerValut(): Promise<void> {
    const ssh = await this.connectToServer();
    const { stdout } = await ssh.execCommand('docker ps -a | grep bloxstaking', {});
    const runAlready = stdout.includes('bloxstaking') && !stdout.includes('Exited');
    if (runAlready) return;

    await ssh.execCommand(`curl -L "https://raw.githubusercontent.com/bloxapp/vault-plugin-secrets-eth2.0/v0.0.10/docker-compose.yml" -o docker-compose.yml && docker-compose up -d vault-image`, {});
    await this.flow.delay(30000);
  }

  async syncVaultWithBlox(): Promise<void> {
    this.flow.validate('otp');
    this.flow.validate('publicIp');
    const ssh = await this.connectToServer();
    const { stdout: rootToken } = await ssh.execCommand('sudo cat data/keys/vault.root.token', {});
    if (!rootToken) throw new Error('root vault-plugin key not found');
    this.conf.set('vaultRootToken', rootToken);
    const { stdout: statusCode, stderr } = await ssh.execCommand(`curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --request POST --data '{"otp": "${conf.get('otp')}", "url": "http://${conf.get('publicIp')}:8200", "accessToken": "${rootToken}"}' http://api.stage.bloxstaking.com/wallets/root`, {});
    if (+statusCode > 201) {
      throw new Error(`Blox Staking api error: ${statusCode} ${stderr}`);
    }
  }

  async deleteBloxAccount(): Promise<void> {
    this.flow.validate('otp');
    const ssh = await this.connectToServer();
    const { stdout: statusCode, stderr } = await ssh.execCommand(`curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --request DELETE http://api.stage.bloxstaking.com/organizations/otp/${conf.get('otp')}`, {});
    if (+statusCode > 201) {
      console.log(chalk.red(`Blox Staking api error: ${statusCode} ${stderr}`));
    }
  }

  async install(): Promise<void> {
    const flowSteps = [
      {
        name: 'Connect to the server by ssh',
        func: this.connectToServer
      },
      {
        name: 'Install docker and docker-compose',
        func: this.installDockerScope
      },
      {
        name: 'Run vault plugin docker container',
        func: this.runDockerValut
      },
      {
        name: 'Sync blox staking with vault plugin container',
        func: this.syncVaultWithBlox
      },
    ];
    await this.flow.run(flowSteps);
  }

  async uninstall(): Promise<void> {
    const flowSteps = [
      {
        name: 'Connect to the server by ssh',
        func: this.connectToServer
      },
      {
        name: 'Delete blox staking account',
        func: this.deleteBloxAccount
      }
    ];
    await this.flow.run(flowSteps);
  }  
}
