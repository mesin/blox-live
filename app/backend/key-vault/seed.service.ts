import Configstore from 'configstore';
import KeyVaultCliService from '../key-vault/key-vault-cli.service';
import { step } from '../decorators';


export default class SeedService extends KeyVaultCliService{
  private readonly conf: Configstore;

  constructor(storeName: string) {
    super();
    this.conf = new Configstore(storeName);
  }

  @step({
    name: 'Seed generate',
  })
  async seedGenerate(): Promise<void> {
    if (this.conf.get('seed'))
      return;

    const { stdout, stderr } = await this.executor(`${this.executablePath} portfolio seed generate`);
    if (stderr) {
      throw new Error(stderr);
    }
    this.conf.set('seed', stdout.replace('\n', ''));
  }

  async mnemonicGenerate(): Promise<void> {
    const { stdout, stderr } = await this.executor(`${this.executablePath} portfolio seed generate --mnemonic`);
    this.execOutput(stdout, stderr);
  }

  async seedToMnemonicGenerate(): Promise<void> {
    const { stdout, stderr } = await this.executor(`${this.executablePath} portfolio seed generate --mnemonic --seed=a42b2d973095bb518e45ae5b372dbff9a3aec572ff74b1c8c54749d34b4479eb`);
    this.execOutput(stdout, stderr);
  }
}
