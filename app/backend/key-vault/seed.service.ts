import { storeService, StoreService } from '../store-manager/store.service';
import KeyVaultCliService from '../communication-manager/key-vault-cli.service';
import { CatchClass } from '../decorators';

@CatchClass<SeedService>()
export default class SeedService extends KeyVaultCliService {
  private readonly storeService: StoreService;

  constructor() {
    super();
    this.storeService = storeService;
  }

  seedGenerate = async (): Promise<void> => {
    if (this.storeService.get('seed')) return;

    const { stdout, stderr } = await this.executor(`${this.executablePath} seed generate`);
    if (stderr) {
      throw new Error(stderr);
    }
    this.storeService.set('seed', stdout.replace('\n', ''));
  };

  getSeed = () => this.storeService.get('seed');

  mnemonicGenerate = async (): Promise<void> => {
    const { stdout, stderr } = await this.executor(`${this.executablePath} mnemonic generate`);
    if (stderr) {
      throw new Error(stderr);
    }
    console.log(stdout);
    return stdout.replace('\n', '');
  };

  storeMnemonic = async (mnemonic: string, password: string): Promise<void> => {
    // TODO validate password & handle password
    console.log('storeMnemonic - password: ', password);
    // generate seed from mnemonic
    const seed = await this.seedFromMnemonicGenerate(mnemonic);
    console.log(seed);
    this.storeService.set('seed', seed);
  };

  seedFromMnemonicGenerate = async (mnemonic): Promise<string> => {
    console.log('seedFromMnemonicGenerate - mnemonic: ', mnemonic);
    if (!mnemonic || mnemonic.length === 0) {
      throw new Error('mnemonic phrase is empty');
    }
    const { stdout, stderr } = await this.executor(`${this.executablePath} seed generate --mnemonic="${mnemonic}"`);
    if (stderr) {
      throw new Error(stderr);
    }
    return stdout.replace('\n', '');
  };
}
