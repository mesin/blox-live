import Store from '../common/store-manager/store';
import getPlatform from '../../get-platform';

const up = async (payload) => {
  if (getPlatform() === 'win') return;
  let baseStore = Store.getStore();
  const currentUserId = baseStore.get('currentUserId');
  const authToken = baseStore.get('authToken');
  Store.close();
  const oldStore = Store.getStore();
  oldStore.init(currentUserId, authToken, true);
  const oldData = oldStore.all();
  oldStore.clear();
  Store.close();
  baseStore = Store.getStore();
  baseStore.init(currentUserId, authToken);
  baseStore.setMultiple(oldData, true);
};

const down = async (payload) => {};

export { up, down };
