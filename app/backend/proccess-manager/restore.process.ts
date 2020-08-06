import SeedService from '../key-vault/seed.service';
import ProcessClass from './process.class';

export default class RestoreProcess extends ProcessClass {
  public readonly seedService: SeedService;
  public readonly actions: Array<any>;

  constructor(storeName: string) {
    super();
    this.seedService = new SeedService(storeName);
    this.actions = [
      { instance: this.seedService, method: 'seedFromMnemonicGenerate' },
    ];
  }
}
