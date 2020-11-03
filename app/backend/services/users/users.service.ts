import { CatchClass } from '../../decorators';
import BloxApi from '../../common/communication-manager/blox-api';
import { METHOD } from '../../common/communication-manager/constants';

@CatchClass<UserService>()
export default class UserService {
  async get() {
    return await BloxApi.request(METHOD.GET, 'users/profile');
  }

  async update(payload: Record<string, any>) {
    return await BloxApi.request(METHOD.PATCH, 'users', payload);
  }
}
