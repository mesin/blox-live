import AwsService from '../aws/aws.service';
import ProcessClass from './process.class';
import KeyVaultService from '../key-vault/key-vault.service';

export default class RebootProcess extends ProcessClass {
  private readonly awsService: AwsService;
  private readonly keyVaultService: KeyVaultService;
  public readonly actions: Array<any>;

  constructor() {
    super();
    this.awsService = new AwsService();
    this.keyVaultService = new KeyVaultService();
    this.actions = [
      { instance: this.awsService, method: 'rebootInstance' },
      { instance: this.keyVaultService, method: 'getKeyVaultStatus' },
    ];
  }
}
