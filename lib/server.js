const NodeSSH = require('node-ssh');
const flow = require('./flow');

const conf = new Configstore('blox-infra');

async function connectToServer() {
  flow.validate('publicIp');
  flow.validate('keyPair');
  const ssh = new NodeSSH();
  await ssh.connect({ host: conf.get('publicIp'), username: 'ec2-user', privateKey: conf.get('keyPair').privateKey });
  return ssh;
}

async function installDockerScope() {
  const ssh = await connectToServer();
  const { stdout } = await ssh.execCommand('docker -v', {});
  const installedAlready = stdout.includes('version');
  if (installedAlready) return;

  await ssh.execCommand('sudo yum update -y', {});
  await ssh.execCommand('sudo yum install docker -y', {});
  await ssh.execCommand('sudo service docker start', {});
  await ssh.execCommand('sudo usermod -a -G docker ec2-user', {});
  await ssh.execCommand('sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose', {});
}

async function runDockerValut() {
  const ssh = await connectToServer();
  const { stdout } = await ssh.execCommand('docker ps -a | grep bloxstaking', {});
  const runAlready = stdout.includes('bloxstaking') && !stdout.includes('Exited');
  if (runAlready) return;

  await ssh.execCommand(`curl -L "https://raw.githubusercontent.com/bloxapp/vault-plugin-secrets-eth2.0/v0.0.8/docker-compose.yml" -o docker-compose.yml && docker-compose up -d vault-image`, {});
  await flow.delay(30000);
}

async function syncVaultWithBlox() {
  flow.validate('otp');
  flow.validate('publicIp');
  const ssh = await connectToServer();
  const { stdout: rootToken } = await ssh.execCommand('sudo cat data/keys/vault.root.token', {});
  if (!rootToken) throw new Error('root vault-plugin key not found');
  conf.set('vaultRootToken', rootToken);
  const { stdout: statusCode, stderr } = await ssh.execCommand(`curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --request POST --data '{"otp": "${conf.get('otp')}", "url": "http://${conf.get('publicIp')}:8200", "accessToken": "${rootToken}"}' http://api.stage.bloxstaking.com/wallets/root`, {});
  if (+statusCode > 201) {
    throw new Error(`Blox Staking api error: ${statusCode} ${stderr}`);
  }
}

async function deleteBloxAccount() {
  flow.validate('otp');
  const ssh = await connectToServer();
  const { stdout: statusCode, stderr } = await ssh.execCommand(`curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --request DELETE http://api.stage.bloxstaking.com/organizations/otp/${otp}`, {});
  if (+statusCode > 201) {
    throw new Error(`Blox Staking api error: ${statusCode} ${stderr}`);
  }
}

const installFlow = [
  {
    name: 'Connect to the server by ssh',
    func: connectToServer
  },
  {
    name: 'Install docker and docker-compose',
    func: installDockerScope
  },
  {
    name: 'Run vault plugin docker container',
    func: runDockerValut
  },
  {
    name: 'Sync blox staking with vault plugin container',
    func: syncVaultWithBlox
  },
]

const uninstallFlow = [
  {
    name: 'Connect to the server by ssh',
    func: connectToServer
  },
  {
    name: 'Delete blox staking account',
    func: deleteBloxAccount
  }
]

module.exports = {
  install:  async () => {
    await flow.run(installFlow);
  },
  uninstall: async () => {
    await flow.run(uninstallFlow);
  }
};
