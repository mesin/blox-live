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
    const otp = conf.get('otp');
    if (!otp) {
      throw new Error('Otp not found. Pass it thru argv param: blox-live --otp XXXXX');
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
      steps = new Steps(6);
      currentStep = steps.advance('Updating the installed packages...', 'hammer_and_wrench', 'yum update').start();
      output = await ssh.execCommand('sudo yum update -y', {});
      currentStep.success('The packages updated', 'white_check_mark');
  
      currentStep = steps.advance('Installing the most recent Docker Community Edition package...', 'hammer_and_wrench', 'yum install docker').start();
      output = await ssh.execCommand('sudo yum install docker -y', {});
      currentStep.success('Docker installed successfully', 'white_check_mark');
  
      currentStep = steps.advance('Starting docker...', 'hourglass_flowing_sand', 'service docker start').start();
      output = await ssh.execCommand('sudo service docker start', {});
      currentStep.success('Docker started successfully', 'white_check_mark');
  
      currentStep = steps.advance('Adding the ec2-user to the docker group...', 'lock', 'usermod -a -G docker ec2-user').start();
      output = await ssh.execCommand('sudo usermod -a -G docker ec2-user', {});
      currentStep.success('User ec2-user added to docker group', 'white_check_mark');

      currentStep = steps.advance('Installing docker-compose...', 'hourglass_flowing_sand', 'install docker-compose').start();
      output = await ssh.execCommand('sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose', {});
      currentStep.success('Docker-compose installed', 'white_check_mark');
      /*
      currentStep = steps.advance('Rebooting instance...', 'computer', 'instance reboot').start();
      await aws.rebootInstance();
      currentStep.success('Instance rebooted', 'white_check_mark');
      */
    }

    if (!dockerImageIsUp) {
      steps = new Steps(4);
      currentStep = steps.advance('Installing git...', 'hammer_and_wrench', 'yum install git').start();
      // output = await ssh.execCommand('sudo yum install git -y', {});
      currentStep.success('Git installed', 'white_check_mark');
  
      currentStep = steps.advance('Clone git repo...', 'hammer_and_wrench', 'git clone vault-plugin repo').start();
      // output = await ssh.execCommand('git clone https://github.com/bloxapp/vault-plugin-secrets-eth2.0 vault-plugin && cd vault-plugin && git checkout stage', {});
      currentStep.success('Git repo cloned', 'white_check_mark');  

      currentStep = steps.advance('Build docker image...', 'hammer_and_wrench', 'docker build').start();
      // output = await ssh.execCommand('cd vault-plugin && docker-compose build vault', {});
      currentStep.success('Vault is up', 'white_check_mark');
  
      currentStep = steps.advance('Running docker instance...', 'hammer_and_wrench', 'docker run').start();
      output = await ssh.execCommand('cd vault-plugin && docker-compose up -d vault', {});
      currentStep.success('Vault is up', 'white_check_mark');
    }

    let rootToken = conf.get('vaultRootToken');
    if (!rootToken) {
      output = await ssh.execCommand('cd vault-plugin && sudo ls -lah keys/vault.root.token', {});
      rootToken = output.stdout;  
      if (!rootToken) throw new Error('root vault-plugin key not found');
      conf.set('vaultRootToken', rootKey);
    }
    
    output = await ssh.execCommand(`curl --request POST --data '{"otp": "${otp}", "url": "http://${publicIp}:8200", "accessToken": "${rootToken}"}'  http://api.stage.bloxstaking.com/wallets/root`, {});
    console.log(output.stdout, output.stderr);
  },
};