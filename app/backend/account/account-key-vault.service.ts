import Configstore from 'configstore';
import KeyVaultCliService from '../key-vault/key-vault-cli.service';
import { step } from '../decorators';


export default class AccountKeyVaultService extends KeyVaultCliService{
  private readonly conf: Configstore;

  constructor(storeName: string) {
    super();
    this.conf = new Configstore(storeName);
  }

  @step({
    name: 'Account create',
    requiredConfig: ['seed'],
  })
  async accountCreate(): Promise<void> {
    const { stdout, stderr } = await this.executor(`${this.executablePath} portfolio account create --index=0 --seed=${this.conf.get('seed')}`);
    if (stderr) {
      throw new Error(stderr);
    }
    console.log(stdout);
  }
}
