import Http from './http';

class KeyVaultApi extends Http {
  constructor(storePrefix: string = '') {
    super(storePrefix);
  }

  init = () => {
    this.instance.defaults.baseURL = `http://${this.store.get('publicIp')}:8200/v1`;
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${this.store.get('vaultRootToken')}`;
  };
}

const keyVaultApi = new KeyVaultApi();

const resolveKeyVaultApi = (storePrefix: string = ''): KeyVaultApi => {
  if (storePrefix) {
    return new KeyVaultApi(storePrefix);
  }
  return keyVaultApi;
};

export {
  keyVaultApi,
  resolveKeyVaultApi,
  KeyVaultApi
};
