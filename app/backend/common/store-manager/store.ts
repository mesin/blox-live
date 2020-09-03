import ElectronStore from 'electron-store';
import BaseStore from './base-store';
import { CatchClass, Step } from '../../decorators';

// TODO import from .env
const tempStorePrefix = 'tmp';

@CatchClass<Store>()
class Store extends BaseStore {
  private store: ElectronStore;
  private readonly prefix: string;

  constructor(prefix: string = '') {
    super();
    this.prefix = prefix;
  }

  init = (userId: string, authToken: string): any => {
    if (!userId) {
      throw new Error('Store not ready to be initialised, currentUserId is missing');
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
    name: 'Creating local backup...'
  })
  prepareTmpStorageConfig(): void {
    const tmpStore = resolveStore(tempStorePrefix);
    tmpStore.setMultiple({
      uuid: store.get('uuid'),
      credentials: store.get('credentials'),
      keyPair: store.get('keyPair'),
      securityGroupId: store.get('securityGroupId'),
      keyVaultStorage: store.get('keyVaultStorage')
    });
  }

  @Step({
    name: 'Configuring local storage...'
  })
  saveTmpConfigIntoMain(): void {
    const tmpStore = resolveStore(tempStorePrefix);
    store.setMultiple({
      uuid: tmpStore.get('uuid'),
      addressId: tmpStore.get('addressId'),
      publicIp: tmpStore.get('publicIp'),
      instanceId: tmpStore.get('instanceId'),
      vaultRootToken: tmpStore.get('vaultRootToken'),
      keyVaultVersion: tmpStore.get('keyVaultVersion'),
      keyVaultStorage: tmpStore.get('keyVaultStorage')
    });
    tmpStore.clear();
  }
}

const store = new Store();

const resolveStore = (storePrefix: string): Store => {
  if (storePrefix) {
    const prefixStore = new Store(storePrefix);
    prefixStore.init(store.get('currentUserId'), store.get('authToken'));
    return prefixStore;
  }
  return store;
};

export {
  store,
  Store,
  resolveStore
};
