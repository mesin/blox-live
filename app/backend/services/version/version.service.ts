import { CatchClass } from '../../decorators';
import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';

@CatchClass<VersionService>()
export default class VersionService {
  private readonly bloxApi: BloxApi;

  constructor() {
    this.bloxApi = new BloxApi();
  }

  async getLatestKeyVaultVersion() {
    return await this.bloxApi.request(METHOD.GET, 'version/key-vault');
  }

  async getLatestBloxLiveVersion() {
    return await this.bloxApi.request(METHOD.GET, 'version/blox-live');
  }
}
