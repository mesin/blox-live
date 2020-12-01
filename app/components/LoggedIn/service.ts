import { v4 as uuidv4 } from 'uuid';
import { version } from 'package.json';
import { getOsVersion } from 'utils/service';
import Store from 'backend/common/store-manager/store';

const store: Store = Store.getStore();

export const handleUserInfo = (updateUserInfo) => {
  if (!store.exists('uuid')) {
    const uuid = uuidv4();
    store.set('uuid', uuid);
    updateUserInfo({ uuid, version, os: getOsVersion() });
  }
};

export const isPrimaryDevice = (userInfoUuid: string) => {
  const storedUuid = store.get('uuid');
  return userInfoUuid === storedUuid;
};

export const inRecoveryProcess = () => {
  const result = !!store.get('inRecoveryProcess');
  return result;
};

export const inForgotPasswordProcess = () => {
  const result = !!store.get('inForgotPasswordProcess');
  return result;
};
