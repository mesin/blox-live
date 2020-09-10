import {CatchClass} from '../decorators';
import BloxApiService from '../communication-manager/blox-api.service';
import {METHOD} from '../communication-manager/constants';

@CatchClass<VersionsService>()
export default class VersionsService {
  async getBloxLiveVersion() {
    return await BloxApiService.request(METHOD.GET, 'version/blox-live');
  }
}
