import { v4 as uuidv4 } from 'uuid';
import AwsService from '../aws/aws.service';
import WalletService from '../wallet/wallet.service';
import KeyVaultService from '../key-vault/key-vault.service';
import ProcessClass from './process.class';
import AccountKeyVaultService from '../account/account-key-vault.service';
import { storeService } from '../store-manager/store.service';

export default class InstallProcess extends ProcessClass {
  private readonly awsService: AwsService;
  private readonly keyVaultService: KeyVaultService;
  private readonly walletService: WalletService;
  private readonly accountKeyVaultService: AccountKeyVaultService;
  public readonly actions: Array<any>;

  constructor({ accessKeyId, secretAccessKey }) {
    super();
    if (!storeService.get('uuid')) {
      storeService.set('uuid', uuidv4());
    }
    storeService.set('credentials', {
      accessKeyId,
      secretAccessKey
    });

    this.keyVaultService = new KeyVaultService();
    this.awsService = new AwsService();
    this.accountKeyVaultService = new AccountKeyVaultService();
    this.walletService = new WalletService();
    this.actions = [
      { instance: this.awsService, method: 'setAWSCredentials' },
      { instance: this.awsService, method: 'validateAWSPermissions' },
      { instance: this.awsService, method: 'createEc2KeyPair' },
      { instance: this.awsService, method: 'createElasticIp' },
      { instance: this.awsService, method: 'createSecurityGroup' },
      { instance: this.awsService, method: 'createInstance' },
      { instance: this.keyVaultService, method: 'installDockerScope' },
      { instance: this.keyVaultService, method: 'runDockerContainer' },
      { instance: this.keyVaultService, method: 'runScripts' },
      { instance: this.accountKeyVaultService, method: 'createWallet' },
      { instance: this.keyVaultService, method: 'getKeyVaultRootToken' },
      { instance: this.keyVaultService, method: 'updateVaultStorage' },
      { instance: this.walletService, method: 'syncVaultWithBlox' },
      { instance: this.keyVaultService, method: 'getKeyVaultStatus' }
    ];
  }
}
