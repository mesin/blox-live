import { app, remote, shell } from 'electron';
import moment from 'moment';
import Store from 'backend/common/store-manager/store';

export const saveLastConnection = () => {
  const now = moment().utc();
  const store = Store.getStore();
  store.set('lastConnection', now);
};

export const loadLastConnection = () => {
  const store = Store.getStore();
  store.get('lastConnection');
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
