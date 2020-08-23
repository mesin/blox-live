import BloxApiService from '../communication-manager/blox-api.service';

export default class WalletService {
  get = async () => {
    const wallets = await BloxApiService.request('GET', 'wallets');
    return JSON.parse(wallets);
  };
}
