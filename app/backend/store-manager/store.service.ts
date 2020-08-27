import ElectronStore from 'electron-store';
import BaseStoreService from './base-store.service';
import { Step } from '../decorators';

// TODO import from .env
const tempStorePrefix = 'tmp';

class StoreService extends BaseStoreService {
  private store: ElectronStore;
  private readonly prefix: string;

  constructor(prefix: string = '') {
    super();
    this.prefix = prefix;
  }

  init = (userId: string, authToken: string): any => {
    if (!userId) {
      throw new Error('Store service not ready to be initialised, currentUserId is missing');
    }
    this.baseStore.set('currentUserId', userId);
    this.baseStore.set('authToken', authToken);
    const storeName = `${this.baseStoreName}${userId ? '-' + userId : ''}${this.prefix ? '-' + this.prefix : ''}`;
    this.store = new ElectronStore({ name: storeName });
  };

  get = (key: string): any => {
    const value = this.store.get(key);
    if (!value) {
      return this.baseStore.get(key);
    }
    return value;
  };

  set = (key: string, value: any): void => {
    this.store.set(key, value);
  };

  setMultiple = (params: any): void => {
    this.store.set(params);
  };

  delete = (key: string): void => {
    this.store.delete(key);
  };

  clear = (): void => {
    this.store.clear();
  };

  logout = (): void => {
    this.baseStore.clear();
  };

  @Step({
    name: 'Prepare tmp storage'
  })
  prepareTmpStorageConfig(): void {
    const tmpStoreService = resolveStoreService(tempStorePrefix);
    tmpStoreService.setMultiple({
      uuid: storeService.get('uuid'),
      credentials: storeService.get('credentials'),
      keyPair: storeService.get('keyPair'),
      securityGroupId: storeService.get('securityGroupId'),
      keyVaultStorage: storeService.get('keyVaultStorage')
    });
  }

  @Step({
    name: 'Store tmp config into main'
  })
  saveTmpConfigIntoMain(): void {
    const tmpStoreService = resolveStoreService(tempStorePrefix);
    storeService.setMultiple({
      uuid: tmpStoreService.get('uuid'),
      addressId: tmpStoreService.get('addressId'),
      publicIp: tmpStoreService.get('publicIp'),
      instanceId: tmpStoreService.get('instanceId'),
      vaultRootToken: tmpStoreService.get('vaultRootToken'),
      keyVaultVersion: tmpStoreService.get('keyVaultVersion'),
      keyVaultStorage: tmpStoreService.get('keyVaultStorage')
    });
    tmpStoreService.clear();
  }
}

const storeService = new StoreService();
const resolveStoreService = (storePrefix: string): StoreService => {
  if (storePrefix) {
    const prefixStoreService = new StoreService(storePrefix);
    prefixStoreService.init(storeService.get('currentUserId'), storeService.get('authToken'));
    return prefixStoreService;
  } else {
    return storeService;
  }
};

export {
  storeService,
  StoreService,
  resolveStoreService
};
