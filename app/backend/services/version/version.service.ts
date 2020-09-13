import { CatchClass } from '../../decorators';
import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';

@CatchClass<VersionService>()
export default class VersionService {
  async getLatestKeyVaultVersion() {
    return await BloxApi.request(METHOD.GET, 'version/key-vault');
  }

  async getLatestBloxLiveVersion() {
    return await BloxApi.request(METHOD.GET, 'version/blox-live');
  }
}
