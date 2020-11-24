import { v4 as uuidv4 } from 'uuid';
import { version } from 'package.json';
import { getOsVersion } from 'utils/service';
import Store from 'backend/common/store-manager/store';

export const handleUserInfo = (updateUserInfo) => {
  const store = Store.getStore();
  if (!store.exists('uuid')) {
    const uuid = uuidv4();
    store.set('uuid', uuid);
    updateUserInfo({ uuid, version, os: getOsVersion() });
  }
};

export const isPrimaryDevice = (userInfoUuid: string) => {
  const store: Store = Store.getStore();
  const storedUuid = store.get('uuid');
  return userInfoUuid === storedUuid;
};

export const inRecoveryProcess = () => {
  const store: Store = Store.getStore();
  const result = !!store.get('inRecoveryProcess');
  return result;
};
