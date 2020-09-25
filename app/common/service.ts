import moment from 'moment';
import Store from 'backend/common/store-manager/store';

const store = Store.getStore();

export const saveLastConnection = () => {
  const now = moment().utc();
  store.set('lastConnection', now);
};

export const loadLastConnection = () => store.get('lastConnection');

export const onWindowClose = () => {
  window.addEventListener('beforeunload', () => {
    saveLastConnection();
  });
};
