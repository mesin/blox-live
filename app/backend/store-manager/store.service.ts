import ElectronStore from 'electron-store';
import { step } from '../decorators';

// TODO import from .env
const baseStoreName = 'blox';

export default class StoreService {
  private readonly store: ElectronStore;

  constructor(prefix: string = '') {
    const baseStore = new ElectronStore({ name: baseStoreName });
    const userId = baseStore.get('userId');
    const storeName = `${baseStoreName}${userId ? '-' + userId : ''}${prefix ? '-' + prefix : ''}`;
    this.store = new ElectronStore({ name: storeName });
  }

  get = (key: string): any => {
    return this.store.get(key);
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

  @step({
    name: 'Delete all items'
  })
  clear(): void {
    this.store.clear();
  };
}
