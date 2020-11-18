import Store from '../common/store-manager/store';

const up = async (payload) => {
  const baseStore = Store.getStore();
  const keyVaultStorage = baseStore.get('keyVaultStorage');
  if (keyVaultStorage && keyVaultStorage.test) {
    baseStore.delete('keyVaultStorage.test');
  }
};

const down = async (payload) => {};

export { up, down };
