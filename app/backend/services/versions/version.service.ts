import {CatchClass} from '../../decorators';
import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';

@CatchClass<VersionsService>()
export default class VersionsService {
  async getBloxLiveVersion() {
    return await BloxApi.request(METHOD.GET, 'version/blox-live');
  }
}
