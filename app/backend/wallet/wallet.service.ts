import BloxApiService from '../communication-manager/blox-api.service';

export default class WalletService {
  private readonly bloxApiService: BloxApiService;

  constructor() {
    this.bloxApiService = new BloxApiService();
  }

  get = async () => {
    const wallets = await this.bloxApiService.request('GET', 'wallets');
    return JSON.parse(wallets);
  };
}
