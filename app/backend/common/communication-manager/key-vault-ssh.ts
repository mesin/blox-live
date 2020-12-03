import NodeSSH from 'node-ssh';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import Store from '../store-manager/store';
import config from '../config';

const userName = 'ec2-user';

export default class KeyVaultSsh {
  private readonly store: Store;

  constructor(storePrefix: string = '') {
    this.store = Store.getStore(storePrefix);
  }

  async getConnection(customPort?): Promise<NodeSSH> {
    const ssh = new NodeSSH();
    const keyPair: any = this.store.get('keyPair');
    await ssh.connect({
      host: this.store.get('publicIp'),
      port: customPort || config.env.SSH_PORT,
      username: userName,
      privateKey: keyPair.privateKey
    });
    return ssh;
  }

  buildCurlCommand(data: any, returnBodyResponse?: boolean): string {
    // eslint-disable-next-line no-nested-ternary
    const body = data.dataAsFile
      ? `@${data.dataAsFile}`
      : data.data ? JSON.stringify(data.data) : '';
    return `curl -s ${!returnBodyResponse ? '-o /dev/null -w "%{http_code}"' : ''} --header "Content-Type: application/json" --header "Authorization: Bearer ${data.authToken}" --request ${data.method} ${body ? `--data '${body}'` : ''} ${data.route} ${data.route.startsWith('https') ? '--insecure' : ''}`;
  }

  async dataToRemoteFile(data: any): Promise<string> {
    const readStream = Readable.from([JSON.stringify(data)]);
    const remoteFileName = `/home/${userName}/${uuidv4}.data`;
    const ssh = await this.getConnection();
    await ssh.withSFTP(async (sftp) => {
      return new Promise((resolve, reject) => {
        const writeStream = sftp.createWriteStream(remoteFileName);
        writeStream.on('error', (err) => {
          reject(err);
        });
        writeStream.on('close', () => {
          resolve();
        });
        writeStream.on('end', () => {
            resolve();
        });
        readStream.pipe(writeStream);
      });
    });
    return remoteFileName;
  }
}
