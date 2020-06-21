const Steps = require('cli-step');
const Configstore = require('configstore');
const NodeSSH = require('node-ssh');
const ssh = new NodeSSH();

const conf = new Configstore('blox-infra');
const aws = require('./aws');

module.exports = {
  setupEnv: async () => {
    const keyPair = conf.get('keyPair');
    if (!keyPair) {
      throw new Error('Can\'t setup environment. Private key not found');
    }
    const publicIp = conf.get('publicIp');
    if (!publicIp) {
      throw new Error('Can\'t setup environment. Ip address not found');
    }
    let steps;
    let currentStep;
    const { privateKey } = keyPair;
    await ssh.connect({
      host: publicIp,
      username: 'ec2-user',
      privateKey
    });
    let output = await ssh.execCommand('docker -v', {});
    const dockerImageBuiltAready = output.stdout.includes('version');
    output = await ssh.execCommand('docker ps -a | grep vault-plugin', {});
    const dockerImageIsUp = output.stdout.includes('vault-plugin') && !output.stdout.includes('Exited');
    if (!dockerImageBuiltAready) {
      steps = new Steps(9);
      currentStep = steps.advance('Updating the installed packages...', 'hammer_and_wrench', 'yum update').start();
      output = await ssh.execCommand('sudo yum update -y', {});
      currentStep.success('The packages updated', 'white_check_mark');
  
      currentStep = steps.advance('Installing the most recent Docker Community Edition package...', 'hammer_and_wrench', 'yum install docker').start();
      output = await ssh.execCommand('sudo yum install docker -y', {});
      currentStep.success('Docker installed successfully', 'white_check_mark');
  
      currentStep = steps.advance('Starting docker...', 'hourglass_flowing_sand', 'service docker start').start();
      output = await ssh.execCommand('sudo service docker start', {});
      currentStep.success('Docker started successfully', 'white_check_mark');
      console.log('->', output.stdout, output.stderr);
  
      currentStep = steps.advance('Adding the ec2-user to the docker group...', 'lock', 'usermod -a -G docker ec2-user').start();
      output = await ssh.execCommand('sudo usermod -a -G docker ec2-user', {});
      currentStep.success('User ec2-user added to docker group', 'white_check_mark');
  
      currentStep = steps.advance('Rebooting instance...', 'computer', 'instance reboot').start();
      await aws.rebootInstance();
      currentStep.success('Instance rebooted', 'white_check_mark');
  
      currentStep = steps.advance('Installing git...', 'hammer_and_wrench', 'yum install git').start();
      output = await ssh.execCommand('sudo yum install git -y', {});
      currentStep.success('Git installed', 'white_check_mark');
  
      currentStep = steps.advance('Clone git repo...', 'hammer_and_wrench', 'git clone vault-plugin repo').start();
      output = await ssh.execCommand('git clone https://github.com/bloxapp/vault-plugin-secrets-eth2.0 vault-plugin && cd vault-plugin && git checkout stage', {});
      currentStep.success('Git repo cloned', 'white_check_mark');  
    }

    if (!dockerImageIsUp) {
      steps = new Steps(2);
      currentStep = steps.advance('Build docker image...', 'hammer_and_wrench', 'docker build').start();
      output = await ssh.execCommand('cd vault-plugin && docker build -t vault-plugin .', {});
      currentStep.success('Vault is up', 'white_check_mark');
  
      currentStep = steps.advance('Running docker instance...', 'hammer_and_wrench', 'docker run').start();
      output = await ssh.execCommand('cd vault-plugin && docker run --cap-add=IPC_LOCK -e VAULT_ADDR=http://127.0.0.1:8200 -e VAULT_API_ADDR=http://127.0.0.1:8200 -e VAULT_CLIENT_TIMEOUT="30s" -v data:/data -p 8200:8200 -d -ti vault-plugin sh', {});
      currentStep.success('Vault is up', 'white_check_mark');
    }
  },
};