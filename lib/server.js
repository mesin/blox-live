const Steps = require('cli-step');
const Configstore = require('configstore');
const NodeSSH = require('node-ssh');

const conf = new Configstore('blox-infra');

const delay = async (ms = 5000) => await new Promise(resolve => setTimeout(resolve, ms));

async function validate (itemName) {
  if (!conf.get(itemName)) {
    throw new Error(`${itemName} not found.`);
  }
}

async function connectToServer() {
  validate('publicIp');
  validate('keyPair');
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
  await delay(30000);
}

async function syncVaultWithBlox() {
  validate('otp');
  validate('publicIp');
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
  validate('otp');
  const ssh = await connectToServer();
  const { stdout: statusCode, stderr } = await ssh.execCommand(`curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --request DELETE http://api.stage.bloxstaking.com/organizations/otp/${otp}`, {});
  if (+statusCode > 201) {
    throw new Error(`Blox Staking api error: ${statusCode} ${stderr}`);
  }
}

async function runFlow(flowSteps) {
  const steps = new Steps(flowSteps.length);
  for (const step of flowSteps) {
    const stepInfo = steps.advance(step.name, 'hammer_and_wrench', '').start();
    try {
      await step.func();
      stepInfo.success(step.name, 'white_check_mark');
    } catch (error) {
      stepInfo.error(step.name);
      throw new Error(error.message);
    }
  }
}

const setupFlow = [
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
  delay,
  setupEnv:  async () => {
    await runFlow(setupFlow);
  },
  uninstall: async () => {
    await runFlow(uninstallFlow);
  }
};
