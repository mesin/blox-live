import Store from '../common/store-manager/store';

const up = async (payload) => {
  const backendStore = Store.getStore();
  backendStore.set('mainrMigrationFlag', '1');
};

const down = async (payload) => {};

export { up, down };
