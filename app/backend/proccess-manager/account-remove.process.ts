import AccountService from '../account/account.service';
import ProcessClass from './process.class';

export default class AccountRemoveProcess extends ProcessClass {
  private readonly accountService: AccountService;
  public readonly actions: Array<any>;

  constructor() {
    super();
    this.accountService = new AccountService();
    this.actions = [
      { instance: this.accountService, method: 'deleteBloxAccount' }
    ];
  }
}
