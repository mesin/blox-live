import { CatchClass } from '../../decorators';
import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';
import Connection from '../../common/store-manager/connection';

@CatchClass<VersionService>()
export default class VersionService {
  private readonly bloxApi: BloxApi;

  constructor() {
    this.bloxApi = new BloxApi();
    this.bloxApi.init();
  }

  async getLatestKeyVaultVersion() {
    if (Connection.db().exists('customKeyVaultVersion')) {
      return Connection.db().get('customKeyVaultVersion');
    }
    return await this.bloxApi.request(METHOD.GET, 'version/key-vault');
  }

  async getLatestBloxLiveVersion() {
    return await this.bloxApi.request(METHOD.GET, 'version/blox-live');
  }
}
