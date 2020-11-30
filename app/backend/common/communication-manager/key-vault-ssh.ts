import Connection from '../store-manager/connection';
import NodeSSH from 'node-ssh';

export default class KeyVaultSsh {
  private storePrefix: string;

  constructor(prefix: string = '') {
    this.storePrefix = prefix;
  }

  getConnection = async (): Promise<NodeSSH> => {
    const ssh = new NodeSSH();
    const keyPair: any = Connection.db(this.storePrefix).get('keyPair');
    await ssh.connect({
      host: Connection.db(this.storePrefix).get('publicIp'),
      username: 'ec2-user',
      privateKey: keyPair.privateKey
    });
    return ssh;
  };

  buildCurlCommand = (data: any, returnBodeyResponse: boolean = false): string => {
    return `curl -s ${!returnBodeyResponse ? '-o /dev/null -w "%{http_code}"' : ''} --header "Content-Type: application/json" --header "Authorization: Bearer ${data.authToken}" --request ${data.method} ${data.data ? `--data '${JSON.stringify(data.data)}'` : ''} ${data.route} ${data.route.startsWith('https') ? '--insecure' : ''}`;
  };
}
