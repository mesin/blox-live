import HttpService from './http.service';

class KeyVaultApiService extends HttpService {
  constructor(storePrefix: string = '') {
    super(storePrefix);
  }

  init = () => {
    this.instance.defaults.baseURL = `http://${this.storeService.get('publicIp')}:8200/v1`;
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${this.storeService.get('vaultRootToken')}`;
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
