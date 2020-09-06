import * as crypto from 'crypto';
import ElectronStore from 'electron-store';
import BaseStore from './base-store';
import { Step } from '../../decorators';

// TODO import from .env
const tempStorePrefix = 'tmp';

export default class Store extends BaseStore {
  private static instances: any = {};
  private storage: ElectronStore;
  private readonly prefix: string;
  private readonly encryptedKeys: Array<string> = ['keyPair', 'seed'];
  private readonly cryptoAlgorith: string = 'aes256';
  private cryptoKey: string;

  private constructor(prefix: string = '', cryptoKey?: string) {
    super();
    this.prefix = prefix;
    this.cryptoKey = cryptoKey;
  }

  static getStore = (prefix: string = '', cryptoKey?: string) => {
    if (!Store.instances[prefix]) {
      Store.instances[prefix] = new Store(prefix, cryptoKey);
    }
    return Store.instances[prefix];
  };

  init = (userId: string, authToken: string): any => {
    if (!userId) {
      throw new Error('Store not ready to be initialised, currentUserId is missing');
    }
    this.baseStore.set('currentUserId', userId);
    this.baseStore.set('authToken', authToken);
    const storeName = `${this.baseStoreName}${userId ? `-${userId}` : ''}${this.prefix ? `-${this.prefix}` : ''}`;
    this.storage = new ElectronStore({ name: storeName });
  };

  get = (key: string): any => {
    const value = this.storage.get(key) || this.baseStore.get(key);
    if (this.encryptedKeys.includes(key)) {
      return this.decrypt(value);
    }
    return value;
  };

  set = (key: string, value: any): void => {
    if (this.encryptedKeys.includes(key)) {
      this.storage.set(key, this.encrypt(value));
    } else {
      this.storage.set(key, value);
    }
  };

  setMultiple = (params: any): void => {
    this.storage.set(params);
  };

  delete = (key: string): void => {
    this.storage.delete(key);
  };

  clear = (): void => {
    this.storage.clear();
  };

  logout = (): void => {
    this.baseStore.clear();
  };

  encrypt = (value): any => {
    const cipher = crypto.createCipheriv(this.cryptoAlgorith, this.cryptoKey, null);
    return `${cipher.update(value, 'utf8', 'hex')}${cipher.final('hex')}`;
  };

  decrypt = (value): any => {
    const decipher = crypto.createDecipheriv(this.cryptoAlgorith, this.cryptoKey, null);
    return `${decipher.update(value, 'hex', 'utf8')}${decipher.final('utf8')}`;
  };

  @Step({
    name: 'Creating local backup...'
  })
  prepareTmpStorageConfig(): void {
    const tmpStore = Store.getStore(tempStorePrefix, this.cryptoKey);
    const store = Store.getStore();
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
    const tmpStore = Store.getStore(tempStorePrefix, this.cryptoKey);
    const store = Store.getStore();
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

/*
const store = new Store();

const resolveStore = (storePrefix: string): Store => {
  if (storePrefix) {
    const prefixStore = new Store(storePrefix);
    prefixStore.init(store.get('currentUserId'), store.get('authToken'));
    return prefixStore;
  }
  return store;
};
*/
