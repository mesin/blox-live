import { resolveStoreService, StoreService } from '../store-manager/store.service';
import NodeSSH from 'node-ssh';

export default class KeyVaultSshService {
  private readonly storeService: StoreService;

  constructor(storePrefix: string = '') {
    this.storeService = resolveStoreService(storePrefix);
  }

  getConnection = async (): Promise<NodeSSH> => {
    const ssh = new NodeSSH();
    const keyPair: any = this.storeService.get('keyPair');
    await ssh.connect({
      host: this.storeService.get('publicIp'),
      username: 'ec2-user',
      privateKey: keyPair.privateKey
    });
    return ssh;
  };

  buildCurlCommand = (data: any): string => {
    return `curl -s -o /dev/null -w "%{http_code}" --header "Content-Type: application/json" --header "Authorization: Bearer ${data.authToken}" --request ${data.method} ${data.data ? `--data '${JSON.stringify(data.data)}'` : ''} ${data.route}`;
  };
}
