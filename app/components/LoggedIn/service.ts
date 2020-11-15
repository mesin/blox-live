// import { v4 as uuidv4 } from 'uuid';
// import { version } from 'package.json';
// import { getOsVersion } from 'utils/service';
import Store from 'backend/common/store-manager/store';

// export const handleUserInfo = (userInfo) => {

// };

export const isPrimaryDevice = (userInfoUuid: string) => {
  const store: Store = Store.getStore();
  const storedUuid = store.get('uuid');
  return userInfoUuid === storedUuid;

  /*
  if (userInfoUuid !== storedUuid) {
    uuid = uuidv4();
    await store.set('uuid', uuid);
  }

  if (uuid) {
    updatedUserInfo.uuid = uuid;
  }

  updatedUserInfo.os = getOsVersion();
  updatedUserInfo.appVersion = version;
  yield put(actions.updateUserInfo(updatedUserInfo));
  yield put(actions.loadUserInfoSuccess(userInfo));
  */
};
