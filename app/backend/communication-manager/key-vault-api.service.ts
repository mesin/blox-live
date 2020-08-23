import HttpService from './http.service';
import got from 'got';

export default class KeyVaultApiService extends HttpService {
  constructor(storePrefix: string = '') {
    super(storePrefix);
    this.instance = got.extend({
      prefixUrl: `http://${this.storeService.get('publicIp')}:8200/v1`,
      headers: {
        'Authorization': `Bearer ${this.storeService.get('vaultRootToken')}`
      }
    });
  }
}
