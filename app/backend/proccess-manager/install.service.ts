import Configstore from 'configstore';
import AwsService from '../aws/aws.service';
import AccountService from '../account/account.service';
import KeyVaultService from '../key-vault/key-vault.service';
import DockerService from '../key-vault/docker.service';
import { Subject } from './subject.interface';
import { Observer } from './observer.interface';

export default class InstallService implements Subject {
  public readonly conf: Configstore;
  public readonly awsService: AwsService;
  public readonly keyVaultService: KeyVaultService;
  public readonly dockerService: DockerService;
  public readonly accountService: AccountService;
  /**
   * @type {Observer[]} List of subscribers. In real life, the list of
   * subscribers can be stored more comprehensively (categorized by event
   * type, etc.).
   */
  private observers: Observer[] = [];

  constructor(storeName: string) {
    this.conf = new Configstore(storeName);
    this.keyVaultService = new KeyVaultService(storeName);
    this.awsService = new AwsService(storeName);
    this.dockerService = new DockerService(storeName);
    this.accountService = new AccountService(storeName);
  }

  async run(): Promise<void> {
    console.log('+ Setup server');
    this.notify({ msg: 'Set AWS Credentials' });
    await this.awsService.setAWSCredentials();
    this.notify({ msg: 'Check AWS keys permissions' });
    await this.awsService.validateAWSPermissions();
    this.notify({ msg: 'Create EC2 Key Pair' });
    await this.awsService.createEc2KeyPair;
    this.notify({ msg: 'Allocate Elastic IP' });
    await this.awsService.createElasticIp();
    this.notify({ msg: 'Create Security Group' });
    await this.awsService.createSecurityGroup();
    this.notify({ msg: 'Setup VPC Linux Instance' });
    await this.awsService.createInstance();

    console.log('+ Install Key Vault');
    this.notify({ msg: 'Install docker and docker-compose' });
    await this.dockerService.installDockerScope();
    this.notify({ msg: 'Run vault plugin docker container' });
    await this.keyVaultService.runDockerContainer();
    this.notify({ msg: 'Run key vault setup scripts' });
    await this.keyVaultService.runScripts();
    this.notify({ msg: 'Sync blox staking with vault plugin container' });
    await this.accountService.syncVaultWithBlox();

    console.log('+ Congratulations. Setup is done!');
  }

  /**
   * The subscription management methods.
   */
  public subscribe(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Subject: Observer has been attached already.');
    }

    console.log('Subject: Attached an observer.');
    this.observers.push(observer);
  }

  public unsubscribe(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Subject: Nonexistent observer.');
    }

    this.observers.splice(observerIndex, 1);
    console.log('Subject: Detached an observer.');
  }

  /**
   * Trigger an update in each subscriber.
   */
  public notify(payload: any): void {
    console.log('Subject: Notifying observers...');
    // eslint-disable-next-line no-restricted-syntax
    for (const observer of this.observers) {
      observer.update(this, payload);
    }
  }
}
