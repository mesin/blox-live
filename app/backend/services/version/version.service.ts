import { CatchClass } from '../../decorators';
import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';
import Store from '../../common/store-manager/store';

@CatchClass<VersionService>()
export default class VersionService {
  private readonly store: Store;

  constructor(storePrefix: string = '') {
    this.store = Store.getStore(storePrefix);
  }

  async getLatestKeyVaultVersion() {
    if (this.store.exists('keyVaultTempVersion')) {
      this.store.get('keyVaultTempVersion');
    }
    return await BloxApi.request(METHOD.GET, 'version/key-vault');
  }

  async getLatestBloxLiveVersion() {
    return await BloxApi.request(METHOD.GET, 'version/blox-live');
  }
}
