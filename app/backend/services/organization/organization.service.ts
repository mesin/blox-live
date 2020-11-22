import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';
import { CatchClass } from '../../decorators';

@CatchClass<OrganizationService>()
export default class OrganizationService {
  private readonly bloxApi: BloxApi;

  constructor() {
    this.bloxApi = new BloxApi();
  }

  async get() {
    return await this.bloxApi.request(METHOD.GET, 'organizations/profile');
  }

  async update(payload: any) {
    return await this.bloxApi.request(METHOD.PATCH, 'organizations/profile', payload);
  }

  async getEventLogs() {
    return await this.bloxApi.request(METHOD.GET, 'organizations/event-logs');
  }

  async reportCrash(payload: any) {
    return await this.bloxApi.request(METHOD.POST, 'organizations/crash-report', payload); // , { 'Content-Type': 'multipart/form-data' }
  }
}
