import AwsService from '../services/aws/aws.service';
import KeyVaultService from '../services/key-vault/key-vault.service';
import ProcessClass from './process.class';
import WalletService from '../services/wallet/wallet.service';
import Connection from '../common/store-manager/connection';
import BaseStore from '../common/store-manager/base-store';

// TODO import from .env
const tempStorePrefix = 'tmp';
const mainStorePrefix = '';
export default class ReinstallProcess extends ProcessClass {
  private readonly awsServiceTmp: AwsService;
  private readonly awsService: AwsService;
  private readonly keyVaultServiceTmp: KeyVaultService;
  private readonly keyVaultService: KeyVaultService;
  private readonly walletService: WalletService;
  public readonly actions: Array<any>;

  constructor() {
    super();
    const baseStore = new BaseStore();
    Connection.setup({
      currentUserId: baseStore.get('currentUserId'),
      authToken: baseStore.get('authToken'),
      prefix: tempStorePrefix
    });
    Connection.cloneCryptoKey({
      fromPrefix: mainStorePrefix,
      toPrefix: tempStorePrefix
    });

    this.keyVaultServiceTmp = new KeyVaultService(tempStorePrefix);
    this.keyVaultService = new KeyVaultService();
    this.awsServiceTmp = new AwsService(tempStorePrefix);
    this.awsService = new AwsService();
    this.walletService = new WalletService(tempStorePrefix);
    this.actions = [
      { instance: this.keyVaultService, method: 'importSlashingData' },
      {
        instance: Connection,
        method: 'clone',
        params: {
          fromPrefix: mainStorePrefix,
          toPrefix: tempStorePrefix,
          fields: ['uuid', 'credentials', 'keyPair', 'securityGroupId', 'keyVaultStorage', 'slashingData'],
          postClean: {
            prefix: mainStorePrefix,
            fields: ['slashingData']
          }
        }
      },
      { instance: this.awsServiceTmp, method: 'setAWSCredentials' },
      { instance: this.awsServiceTmp, method: 'createElasticIp' },
      { instance: this.awsServiceTmp, method: 'createInstance' },
      { instance: this.keyVaultServiceTmp, method: 'installDockerScope' },
      { instance: this.keyVaultServiceTmp, method: 'runDockerContainer' },
      { instance: this.keyVaultServiceTmp, method: 'getKeyVaultRootToken' },
      { instance: this.keyVaultServiceTmp, method: 'updateVaultMountsStorage' },
      { instance: this.keyVaultServiceTmp, method: 'exportSlashingData' },
      { instance: this.walletService, method: 'syncVaultWithBlox', params: { isNew: false } },
      { instance: this.awsService, method: 'truncateServer' },
      {
        instance: Connection,
        method: 'clone',
        params: {
          fromPrefix: tempStorePrefix,
          toPrefix: mainStorePrefix,
          fields: ['uuid', 'addressId', 'publicIp', 'instanceId', 'vaultRootToken', 'keyVaultVersion', 'keyVaultStorage'],
          postClean: {
            prefix: tempStorePrefix
          }
        }
      },
      { instance: this.keyVaultService, method: 'getKeyVaultStatus' }
    ];
  }
}
