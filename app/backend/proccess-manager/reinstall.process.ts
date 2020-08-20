import AwsService from '../aws/aws.service';
import AccountService from '../account/account.service';
import KeyVaultService from '../key-vault/key-vault.service';
import DockerService from '../key-vault/docker.service';
import ProcessClass from './process.class';

// TODO import from .env
const tempStorePrefix = 'tmp';

export default class ReinstallProcess extends ProcessClass {
  private readonly awsService: AwsService;
  private readonly awsServiceOld: AwsService;
  private readonly keyVaultService: KeyVaultService;
  private readonly keyVaultServiceOld: KeyVaultService;
  private readonly dockerService: DockerService;
  private readonly accountService: AccountService;
  private readonly accountServiceOld: AccountService;
  public readonly actions: Array<any>;

  constructor() {
    super();
    this.keyVaultService = new KeyVaultService(tempStorePrefix);
    this.keyVaultServiceOld = new KeyVaultService();
    this.awsService = new AwsService(tempStorePrefix);
    this.awsServiceOld = new AwsService();
    this.dockerService = new DockerService();
    this.accountService = new AccountService(tempStorePrefix);
    this.accountServiceOld = new AccountService();
    this.actions = [
      { instance: this.accountServiceOld, method: 'prepareTmpStorageConfig' },
      { instance: this.awsService, method: 'setAWSCredentials' },
      { instance: this.awsService, method: 'createElasticIp' },
      { instance: this.awsService, method: 'createInstance' },
      { instance: this.dockerService, method: 'installDockerScope' },
      { instance: this.keyVaultService, method: 'runDockerContainer' },
      { instance: this.keyVaultService, method: 'runScripts' },
      { instance: this.accountService, method: 'getKeyVaultRootToken' },
      { instance: this.keyVaultService, method: 'updateVaultStorage' },
      { instance: this.accountService, method: 'resyncNewVaultWithBlox' },
      { instance: this.awsServiceOld, method: 'truncateServer' },
      { instance: this.accountServiceOld, method: 'saveTmpConfigIntoMain' },
      { instance: this.keyVaultServiceOld, method: 'getKeyVaultStatus' }
    ];
  }
}
