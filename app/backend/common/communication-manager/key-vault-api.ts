import Http from './http';
import Connection from '../store-manager/connection';
import KeyVaultSsh from './key-vault-ssh';
import { isVersionHigherOrEqual } from '../../../utils/service';
import config from '../config';

export default class KeyVaultApi extends Http {
  private storePrefix: string;
  private readonly keyVaultSsh: KeyVaultSsh;

  constructor(prefix: string = '') {
    super();
    this.storePrefix = prefix;
    this.keyVaultSsh = new KeyVaultSsh(prefix);
  }

  init(isNetworkRequired: boolean = true) {
    let network: string;
    if (isNetworkRequired) {
      network = Connection.db(this.storePrefix).get('network');
      if (!network) {
        throw new Error('Configuration settings network not found');
      }
    }
    this.instance.defaults.baseURL = `http://${Connection.db(this.storePrefix).get('publicIp')}:8200/v1/${isNetworkRequired ? `ethereum/${network}` : ''}`;
    this.instance.defaults.headers.common.Authorization = `Bearer ${Connection.db(this.storePrefix).get('vaultRootToken')}`;
  }

  async requestThruSsh({
    method,
    path,
    data = null,
    isNetworkRequired = true
  }): Promise<any> {
    let network: string;
    if (isNetworkRequired) {
      network = Connection.db(this.storePrefix).get('network');
      if (!network) {
        throw new Error('Configuration settings network not found');
      }
    }
    const ssh = await this.keyVaultSsh.getConnection();
    let remoteFileName;
    if (data) {
      remoteFileName = await this.keyVaultSsh.dataToRemoteFile(data);
    }
    const keyVaultVersion = Connection.db(this.storePrefix).get('keyVaultVersion');
    const command = this.keyVaultSsh.buildCurlCommand({
      authToken: Connection.db(this.storePrefix).get('vaultRootToken'),
      method,
      // data: { data },
      dataAsFile: remoteFileName,
      route: `http${isVersionHigherOrEqual(keyVaultVersion, config.env.SSL_SUPPORTED_TAG) ? 's' : ''}://localhost:8200/v1/${isNetworkRequired ? `ethereum/${network}/` : ''}${path}`
    }, true);
    console.log('curl=', command);
    const { stdout, stderr } = await ssh.execCommand(command, {});
    if (stderr) {
      throw new Error(stderr);
    }
    const body = JSON.parse(stdout);
    // remoteFileName && await ssh.execCommand(`rm ${remoteFileName}`, {});
    console.log('curl answer=', body);
    if (body.errors) {
      throw new Error(JSON.stringify(body));
    }
    return body;
  }
}
