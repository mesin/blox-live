import ElectronStore from 'electron-store';
import KeyVaultCliService from './key-vault-cli.service';
import { step } from '../decorators';

export default class SeedService extends KeyVaultCliService {
  private readonly conf: ElectronStore;

  constructor(storeName: string) {
    super();
    this.conf = new ElectronStore({ name: storeName });
  }

  @step({
    name: 'Seed generate',
  })
  async seedGenerate(): Promise<void> {
    if (this.conf.get('seed')) return;

    const { stdout, stderr } = await this.executor(`${this.executablePath} seed generate`);
    if (stderr) {
      throw new Error(stderr);
    }
    this.conf.set('seed', stdout.replace('\n', ''));
  }

  @step({
    name: 'Mnemonic generate',
  })
  async mnemonicGenerate(): Promise<void> {
    const { stdout, stderr } = await this.executor(`${this.executablePath} mnemonic generate`);
    if (stderr) {
      throw new Error(stderr);
    }
    console.log(stdout);
    return stdout.replace('\n', '')
  }

  @step({
    name: 'Mnemonic to Seed generate',
    requiredConfig: ['mnemonic'],
  })
  async seedFromMnemonicGenerate(): Promise<void> {
    if (this.conf.get('seed')) return;
    const { stdout, stderr } = await this.executor(`${this.executablePath} seed generate --mnemonic="${this.conf.get('mnemonic')}"`);
    if (stderr) {
      throw new Error(stderr);
    }
    console.log(stdout);
    this.conf.set('seed', stdout.replace('\n', ''));
    this.conf.delete("mnemonic")
  }
}
