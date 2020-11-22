import ElectronStore from 'electron-store';

// TODO import from .env
const baseStoreName = 'blox';

export default class BaseStore {
  protected readonly baseStore: ElectronStore;
  public baseStoreName: string;

  constructor() {
    this.baseStoreName = baseStoreName;
    this.baseStore = new ElectronStore({ name: baseStoreName });
  }

  set(key: string, value: any): void {
    this.baseStore.set(key, value);
  }

  get(key: string): any {
    return this.baseStore.get(key);
  }

  delete(key: string): any {
    this.baseStore.delete(key);
  }

  clear(): void {
    this.baseStore.clear();
  }
}
