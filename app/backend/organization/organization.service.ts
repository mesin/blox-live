import BloxApiService from '../communication-manager/blox-api.service';

export default class OrganizationService {

  get = async () => {
    return await BloxApiService.request('GET', 'organizations/profile');
  };

  update = async (payload: any) => {
    return await BloxApiService.request('PATCH', 'organizations/profile', payload);
  };
}
