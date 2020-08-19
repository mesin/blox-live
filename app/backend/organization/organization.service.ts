import BloxApiService from '../communication-manager/blox-api.service';

export default class OrganizationService {
  private readonly bloxApiService: BloxApiService;

  constructor() {
    this.bloxApiService = new BloxApiService();
  }

  get = async () => {
    return await this.bloxApiService.request('GET', 'organizations/profile');
  };

  update = async (payload: any) => {
    return await this.bloxApiService.request('PATCH', 'organizations/profile', payload);
  };
}
