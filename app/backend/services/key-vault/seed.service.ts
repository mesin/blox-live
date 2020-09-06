import Store from '../../common/store-manager/store';
import KeyVaultCli from '../../common/communication-manager/key-vault-cli';
import { CatchClass } from '../../decorators';

@CatchClass<SeedService>()
export default class SeedService extends KeyVaultCli {
  private readonly store: Store;

  constructor() {
    super();
    this.store = Store.getStore();
  }

  async seedGenerate(): Promise<void> {
    if (this.store.get('seed')) return;

    const { stdout, stderr } = await this.executor(`${this.executablePath} seed generate`);
    if (stderr) {
      throw new Error(stderr);
    }
    this.store.set('seed', stdout.replace('\n', ''));
  }

  getSeed() {
    return this.store.get('seed');
  }

  async mnemonicGenerate(): Promise<void> {
    const { stdout, stderr } = await this.executor(`${this.executablePath} mnemonic generate`);
    if (stderr) {
      throw new Error(stderr);
    }
    console.log(stdout);
    return stdout.replace('\n', '');
  }

  async storeMnemonic(mnemonic: string, password: string): Promise<void> {
    // TODO validate password & handle password
    console.log('storeMnemonic - password: ', password);
    // generate seed from mnemonic
    const seed = await this.seedFromMnemonicGenerate(mnemonic);
    console.log(seed);
    this.store.set('seed', seed);
  }

  async seedFromMnemonicGenerate(mnemonic): Promise<string> {
    console.log('seedFromMnemonicGenerate - mnemonic: ', mnemonic);
    if (!mnemonic || mnemonic.length === 0) {
      throw new Error('mnemonic phrase is empty');
    }
    const { stdout, stderr } = await this.executor(`${this.executablePath} seed generate --mnemonic="${mnemonic}"`);
    if (stderr) {
      throw new Error(stderr);
    }
    return stdout.replace('\n', '');
  }
}
