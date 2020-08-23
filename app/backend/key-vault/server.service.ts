import { resolveStoreService, StoreService } from '../store-manager/store.service';
import NodeSSH from 'node-ssh';

export default class ServerService {
  private readonly storeService: StoreService;

  constructor(storePrefix: string = '') {
    this.storeService = resolveStoreService(storePrefix);
  }

  getConnection = async (): Promise<NodeSSH> => {
    // this.flow.validate('publicIp');
    // this.flow.validate('keyPair');
    const ssh = new NodeSSH();
    const keyPair: any = this.storeService.get('keyPair');
    await ssh.connect({
      host: this.storeService.get('publicIp'),
      username: 'ec2-user',
      privateKey: keyPair.privateKey
    });
    return ssh;
  };
}
