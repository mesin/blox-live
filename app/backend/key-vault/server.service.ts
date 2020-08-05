import ElectronStore from 'electron-store';
import NodeSSH from 'node-ssh';

export default class ServerService {
  public readonly conf: ElectronStore;

  constructor(storeName: string) {
    this.conf = new ElectronStore({ name: storeName });
  }

  async getConnection(): Promise<NodeSSH> {
    // this.flow.validate('publicIp');
    // this.flow.validate('keyPair');
    const ssh = new NodeSSH();
    const keyPair : any = this.conf.get('keyPair');
    await ssh.connect({
      host: this.conf.get('publicIp'),
      username: 'ec2-user',
      privateKey: keyPair.privateKey,
    });
    return ssh;
  }
}
