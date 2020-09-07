import BloxApiService from '../communication-manager/blox-api.service';
import { METHOD } from '../communication-manager/constants';
import { CatchClass } from '../decorators';

@CatchClass<OrganizationService>()
export default class OrganizationService {
  async get() {
    return await BloxApiService.request(METHOD.GET, 'organizations/profile');
  }

  async update(payload: any) {
    return await BloxApiService.request(METHOD.PATCH, 'organizations/profile', payload);
  }

  async getEventLogs() {
    return await BloxApiService.request(METHOD.GET, 'organizations/event-logs');
  }
}
