import ElectronStore from 'electron-store';

// TODO import from .env
const baseStoreName = 'blox';

export default class BaseStore {
  protected readonly baseStore: ElectronStore;
  protected baseStoreName: string;

  constructor() {
    this.baseStoreName = baseStoreName;
    this.baseStore = new ElectronStore({ name: baseStoreName });
  }

  set = (key: string, value: any): void => {
    this.baseStore.set(key, value);
  };

  clear = (): void => {
    this.baseStore.clear();
  };
}
