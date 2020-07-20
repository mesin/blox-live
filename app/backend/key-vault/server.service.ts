import Configstore from 'configstore';
import NodeSSH from 'node-ssh';

export default class ServerService {
  public readonly conf: Configstore;

  constructor(storeName: string) {
    this.conf = new Configstore(storeName);
  }

  async getConnection(): Promise<NodeSSH> {
    // this.flow.validate('publicIp');
    // this.flow.validate('keyPair');
    const ssh = new NodeSSH();
    await ssh.connect({
      host: this.conf.get('publicIp'),
      username: 'ec2-user',
      privateKey: this.conf.get('keyPair').privateKey,
    });
    return ssh;
  }
}
