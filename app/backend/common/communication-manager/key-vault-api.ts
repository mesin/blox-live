import Http from './http';
import Connection from '../store-manager/connection';

export default class KeyVaultApi extends Http {
  private storePrefix: string;

  constructor(prefix: string = '') {
    super();
    this.storePrefix = prefix;
  }

  init = (isNetworkRequired: boolean = true) => {
    let network: string;
    if (isNetworkRequired) {
      network = Connection.db(this.storePrefix).get('network');
      if (!network) {
        throw new Error('Configuration settings network not found');
      }
    }
    this.instance.defaults.baseURL = `http://${Connection.db(this.storePrefix).get('publicIp')}:8200/v1/${isNetworkRequired ? `ethereum/${network}` : ''}`;
    this.instance.defaults.headers.common.Authorization = `Bearer ${Connection.db(this.storePrefix).get('vaultRootToken')}`;
  };
}
