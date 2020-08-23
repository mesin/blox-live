import ElectronStore from 'electron-store';
import BaseStoreService from './base-store.service';

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
