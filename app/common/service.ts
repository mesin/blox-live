import { app, remote, shell } from 'electron';
import moment from 'moment';
import Connection from 'backend/common/store-manager/connection';

export const saveLastConnection = () => {
  const now = moment().utc();
  Connection.db().set('lastConnection', now);
};

export const loadLastConnection = () => {
  Connection.db().get('lastConnection');
};

export const onWindowClose = () => {
  window.addEventListener('beforeunload', () => {
    saveLastConnection();
  });
};

export const openLocalDirectory = (directory: string) => {
  const dataPath = (app || remote.app).getPath('userData');
  shell.openExternal(`file:///${dataPath}/${directory}`);
};
