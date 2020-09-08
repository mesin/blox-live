import * as crypto from 'crypto';
import ElectronStore from 'electron-store';
import BaseStore from './base-store';
import { Logger } from '../logger/logger';
import { Step } from '../../decorators';

// TODO import from .env
const tempStorePrefix = 'tmp';

export default class Store extends BaseStore {
  private static instances: any = {};
  private storage: ElectronStore;
  private readonly prefix: string;
  private readonly encryptedKeys: Array<string> = ['keyPair', 'seed', 'credentials'];
  private readonly cryptoAlgorithm: string = 'aes-256-ecb';
  private cryptoKey: string;
  private cryptoKeyTTL: number = 15; // 15 minutes
  private timer: any;
  private logger: Logger;

  private constructor(prefix: string = '') {
    super();
    this.prefix = prefix;
    this.logger = new Logger();
  }

  static getStore = (prefix: string = '') => {
    if (!Store.instances[prefix]) {
      console.log('USE EXISTED STORE', prefix);
      Store.instances[prefix] = new Store(prefix);
    }
    return Store.instances[prefix];
  };

  setCryptoKey = (cryptoKey: string) => {
    // clean timer which was run before, and run new one
    this.unsetCryptoKey();
    this.cryptoKey = crypto
      .createHash('sha256')
      .update(String(cryptoKey))
      .digest('base64')
      .substr(0, 32);
    console.log('key', this.cryptoKey);
    this.logger.error('setCryptoKey');
    this.timer = setTimeout(this.unsetCryptoKey, this.cryptoKeyTTL * 60 * 1000);
  };

  unsetCryptoKey = () => {
    console.error('UNSET crypto key');
    this.logger.error('unsetCryptoKey');
    this.cryptoKey = null;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
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
    if (value && this.encryptedKeys.includes(key)) {
      return this.decrypt(value);
    }
    return value;
  };

  set = (key: string, value: any): void => {
    if (value && this.encryptedKeys.includes(key)) {
      this.storage.set(key, this.encrypt(value));
    } else {
      this.storage.set(key, value);
    }
  };

  setMultiple = (params: any): void => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key of params) {
      this.set(key, params[key]);
    }
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
    try {
      const str = Buffer.from(JSON.stringify(value)).toString('base64');
      const cipher = crypto.createCipheriv(this.cryptoAlgorithm, this.cryptoKey, null);
      const encrypted = Buffer.concat([cipher.update(str), cipher.final()]);
      return encrypted.toString('hex');
    } catch (e) {
      console.error('Encrypt failed', e);
      return value;
      // throw new Error('not possible to encrypt value');
    }
  };

  decrypt = (value): any => {
    try {
      const decipher = crypto.createDecipheriv(this.cryptoAlgorithm, this.cryptoKey, null);
      const encryptedText = Buffer.from(value, 'hex');
      const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
      return JSON.parse(Buffer.from(decrypted.toString(), 'base64').toString('ascii'));
    } catch (e) {
      console.error('Decrypt failed', e);
      return value;
      // throw new Error('not possible to decrypt value');
    }
  };

  setNewPassword = (cryptoKey: string) => {
    const object = {};
    this.encryptedKeys.forEach((encryptedKey) => {
      const value = this.get(encryptedKey);
      object[encryptedKey] = value;
    });
     this.unsetCryptoKey();
     this.setCryptoKey(cryptoKey);
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(object)) {
      this.set(key, value);
    }
  };

  @Step({
    name: 'Creating local backup...'
  })
  prepareTmpStorageConfig(): void {
    const tmpStore: Store = Store.getStore(tempStorePrefix);
    const store: Store = Store.getStore();
    tmpStore.setMultiple({
      uuid: store.get('uuid'),
      credentials: store.get('credentials'),
      keyPair: store.get('keyPair'),
      securityGroupId: store.get('securityGroupId'),
      keyVaultStorage: store.get('keyVaultStorage'),
      slashingData: store.get('slashingData')
    });
    store.delete('slashingData');
  }

  @Step({
    name: 'Configuring local storage...'
  })
  saveTmpConfigIntoMain(): void {
    const tmpStore: Store = Store.getStore(tempStorePrefix);
    const store: Store = Store.getStore();
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
