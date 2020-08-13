import AwsService from '../aws/aws.service';
import AccountService from '../account/account.service';
import KeyVaultService from '../key-vault/key-vault.service';
import DockerService from '../key-vault/docker.service';
import ProcessClass from './process.class';

export default class ReinstallProcess extends ProcessClass {
  public readonly awsService: AwsService;
  public readonly awsServiceOld: AwsService;
  public readonly keyVaultService: KeyVaultService;
  public readonly keyVaultServiceOld: KeyVaultService;
  public readonly dockerService: DockerService;
  public readonly accountService: AccountService;
  public readonly accountServiceOld: AccountService;
  public readonly actions: Array<any>;

  constructor() {
    super();
    this.keyVaultService = new KeyVaultService(`${this.storeName}-tmp`);
    this.keyVaultServiceOld = new KeyVaultService(this.storeName);
    this.awsService = new AwsService(`${this.storeName}-tmp`);
    this.awsServiceOld = new AwsService(this.storeName);
    this.dockerService = new DockerService(`${this.storeName}-tmp`);
    this.accountService = new AccountService(`${this.storeName}-tmp`);
    this.accountServiceOld = new AccountService(this.storeName);
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
      { instance: this.keyVaultServiceOld, method: 'getKeyVaultStatus' },
    ];
  }
}
