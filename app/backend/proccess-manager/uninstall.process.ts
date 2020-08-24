import AwsService from '../aws/aws.service';
import ProcessClass from './process.class';
import WalletService from '../wallet/wallet.service';

export default class UninstallProcess extends ProcessClass {
  private readonly awsService: AwsService;
  private readonly walletService: WalletService;
  public readonly actions: Array<any>;

  constructor() {
    super();
    this.awsService = new AwsService();
    this.walletService = new WalletService();
    this.actions = [
      { instance: this.walletService, method: 'removeBloxWallet' },
      { instance: this.awsService, method: 'uninstallItems' }
    ];
  }
}
