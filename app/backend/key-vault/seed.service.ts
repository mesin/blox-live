import ElectronStore from 'electron-store';
import KeyVaultCliService from './key-vault-cli.service';
import { step } from '../decorators';

export default class SeedService extends KeyVaultCliService {
  private readonly conf: ElectronStore;

  constructor(storeName: string) {
    super();
    this.conf = new ElectronStore({ name: storeName });
    this.mnemonicGenerate = this.mnemonicGenerate.bind(this);
  }

  @step({
    name: 'Seed generate'
  })
  async seedGenerate(): Promise<void> {
    if (this.conf.get('seed')) return;

    const { stdout, stderr } = await this.executor(`${this.executablePath} seed generate`);
    if (stderr) {
      throw new Error(stderr);
    }
    this.conf.set('seed', stdout.replace('\n', ''));
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
    console.log("storeMnemonic - password: ", password);
    // generate seed from mnemonic
    const seed = await this.seedFromMnemonicGenerate(mnemonic);
    console.log(seed);
    this.conf.set('seed', seed);
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
