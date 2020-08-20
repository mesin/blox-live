import ElectronStore from 'electron-store';
import BaseStoreService from './base-store.service';

export default class StoreService extends BaseStoreService {
  private readonly store: ElectronStore;

  constructor(prefix: string = '') {
    super();
    const userId = this.baseStore.get('currentUserId');
    if (!userId) {
      throw new Error('Store service not ready to be initialised, currentUserId is missing');
    }
    const storeName = `${this.baseStoreName}${userId ? `-${userId}` : ''}${prefix ? `-${prefix}` : ''}`;
    this.store = new ElectronStore({ name: storeName });
  }

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
}
