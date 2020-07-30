import Configstore from 'configstore';
import KeyVaultCliService from '../key-vault/key-vault-cli.service';
import { step } from '../decorators';


export default class SeedService extends KeyVaultCliService {
  private readonly conf: Configstore;

  constructor(storeName: string) {
    super();
    this.conf = new Configstore(storeName);
  }

  @step({
    name: 'Seed generate'
  })
  async seedGenerate(): Promise<void> {
    if (this.conf.get('seed'))
      return;

    const { stdout, stderr } = await this.executor(`${this.executablePath} seed generate`);
    if (stderr) {
      throw new Error(stderr);
    }
    this.conf.set('seed', stdout.replace('\n', ''));
  }

  @step({
    name: 'Mnemonic generate'
  })
  async mnemonicGenerate(): Promise<void> {
    const { stdout, stderr } = await this.executor(`${this.executablePath} seed generate --mnemonic`);
    this.execOutput(stdout, stderr);
  }

  @step({
    name: 'Seed to Mnemonic generate',
    requiredConfig: ['seed']
  })
  async seedToMnemonicGenerate(): Promise<void> {
    const { stdout, stderr } = await this.executor(`${this.executablePath} seed generate --mnemonic --seed=${this.conf.get('seed')}`);
    this.execOutput(stdout, stderr);
  }
}
