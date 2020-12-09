import { v4 as uuidv4 } from 'uuid';
import { version } from 'package.json';
import { getOsVersion } from 'utils/service';
import Connection from 'backend/common/store-manager/connection';

export const handleUserInfo = (updateUserInfo) => {
  if (!Connection.db().exists('uuid')) {
    const uuid = uuidv4();
    Connection.db().set('uuid', uuid);
    updateUserInfo({ uuid, version, os: getOsVersion() });
  }
};

export const isPrimaryDevice = (userInfoUuid: string) => {
  return userInfoUuid === Connection.db().get('uuid');
};

export const inRecoveryProcess = () => {
  const result = !!Connection.db().get('inRecoveryProcess');
  return result;
};

export const inForgotPasswordProcess = () => {
  const result = !!Connection.db().get('inForgotPasswordProcess');
  return result;
};
