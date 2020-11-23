import { v4 as uuidv4 } from 'uuid';
import AccountService from '../services/account/account.service';
import AwsService from '../services/aws/aws.service';
import WalletService from '../services/wallet/wallet.service';
import KeyVaultService from '../services/key-vault/key-vault.service';
import UsersService from '../services/users/users.service';
import ProcessClass from './process.class';
import Store from '../common/store-manager/store';

export default class RecoveryProcess extends ProcessClass {
  private readonly accountService: AccountService;
  private readonly awsService: AwsService;
  private readonly keyVaultService: KeyVaultService;
  private readonly walletService: WalletService;
  private readonly userService: UsersService;
  public readonly actions: Array<any>;

  constructor({ accessKeyId, secretAccessKey, isNew = true }) {
    super();
    this.accountService = new AccountService();
    this.awsService = new AwsService();
    this.keyVaultService = new KeyVaultService();
    this.userService = new UsersService();
    this.walletService = new WalletService();

    const store: Store = Store.getStore();

    const uuid = uuidv4();
    store.set('uuid', uuid);
    store.set('credentials', { accessKeyId, secretAccessKey });
    this.userService.update({ uuid });

    this.actions = [
      { instance: this.accountService, method: 'recoveryAccounts' },
      { instance: this.awsService, method: 'setAWSCredentials' },
      { instance: this.awsService, method: 'validateAWSPermissions' },
      { instance: this.awsService, method: 'createEc2KeyPair' },
      { instance: this.awsService, method: 'createElasticIp' },
      { instance: this.awsService, method: 'createSecurityGroup' },
      { instance: this.awsService, method: 'createInstance' },
      { instance: this.keyVaultService, method: 'installDockerScope' },
      { instance: this.keyVaultService, method: 'runDockerContainer' },
      { instance: this.keyVaultService, method: 'getKeyVaultRootToken' },
      { instance: this.walletService, method: 'syncVaultWithBlox', params: { isNew } },
      { instance: this.keyVaultService, method: 'getKeyVaultStatus' },
      { instance: this.keyVaultService, method: 'updateVaultMountsStorage' }
    ];
  }
}
