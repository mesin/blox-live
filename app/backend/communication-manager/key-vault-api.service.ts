import HttpService from './http.service';
import got from 'got';

class KeyVaultApiService extends HttpService {
  constructor(storePrefix: string = '') {
    super(storePrefix);
  }

  init = (): void => {
    this.instance = got.extend({
      prefixUrl: `http://${this.storeService.get('publicIp')}:8200/v1`,
      headers: {
        'Authorization': `Bearer ${this.storeService.get('vaultRootToken')}`
      }
    });
  };
}

const keyVaultApiService = new KeyVaultApiService();
const resolveKeyVaultApiService = (storePrefix: string = ''): KeyVaultApiService => {
  if (storePrefix) {
    return new KeyVaultApiService(storePrefix);
  }
  return keyVaultApiService;
};

export {
  keyVaultApiService,
  resolveKeyVaultApiService,
  KeyVaultApiService
};
