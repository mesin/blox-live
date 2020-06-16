const Configstore = require('configstore');
const NodeSSH = require('node-ssh');
const ssh = new NodeSSH();

const conf = new Configstore('blox-infra');

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

    const { privateKey } = keyPair;
    await ssh.connect({
      host: publicIp,
      username: 'ubuntu',
      privateKey
    });
    // const output = await ssh.execCommand('mkdir blox-live && cd blox-live && curl https://raw.githubusercontent.com/prysmaticlabs/prysm/master/prysm.sh --output prysm.sh && chmod +x prysm.sh', {});
    const output = await ssh.execCommand('cd blox-live && ls -lah', {});
    console.log(output.stdout, output.stderr);
  },
};