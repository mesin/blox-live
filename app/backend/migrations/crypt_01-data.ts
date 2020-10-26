import Store from '../common/store-manager/store';

const up = async (payload) => {
  const backendStore = Store.getStore();
  backendStore.set('credentialsCopyMigration', backendStore.get('credentials'));
};

const down = async (payload) => {};

export { up, down };
