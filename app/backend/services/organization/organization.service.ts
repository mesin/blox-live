import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';
import { CatchClass } from '../../decorators';

@CatchClass<OrganizationService>()
export default class OrganizationService {
  async get() {
    return await BloxApi.request(METHOD.GET, 'organizations/profile');
  }

  async update(payload: any) {
    return await BloxApi.request(METHOD.PATCH, 'organizations/profile', payload);
  }

  async getEventLogs() {
    return await BloxApi.request(METHOD.GET, 'organizations/event-logs');
  }
}
