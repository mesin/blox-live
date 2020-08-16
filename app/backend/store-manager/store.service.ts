import ElectronStore from 'electron-store';
import { step } from '../decorators';

// TODO import from .env
const baseStoreName = 'blox';

export default class StoreService {
  private readonly store: ElectronStore;
  private readonly baseStore: ElectronStore;

  constructor(prefix: string = '', isBase: boolean = false) {
    let storeName: string;
    if (isBase) {
      storeName = baseStoreName;
    } else {
      this.baseStore = new ElectronStore({ name: baseStoreName });
      storeName = `${baseStoreName}-${this.baseStore.get('userId')}${prefix}`;
    }
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
  clear(): void{
    this.store.clear();
  };
}
