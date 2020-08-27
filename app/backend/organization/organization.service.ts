import BloxApiService from '../communication-manager/blox-api.service';
import { METHOD } from '../communication-manager/constants';
import { CatchClass } from '../decorators';

@CatchClass<OrganizationService>()
export default class OrganizationService {

  get = async () => {
    return await BloxApiService.request(METHOD.GET, 'organizations/profile');
  };

  update = async (payload: any) => {
    return await BloxApiService.request(METHOD.PATCH, 'organizations/profile', payload);
  };
}
