// import Store from '../common/store-manager/store';
// import getPlatform from '../../get-platform';

const up = async (payload) => {
  /*
  if (getPlatform() === 'win') return;
  const baseStore = Store.getStore();
  const currentUserId = baseStore.get('currentUserId');
  const authToken = baseStore.get('authToken');
  baseStore.init(currentUserId, authToken, true);
  const oldData = baseStore.all();
  baseStore.clear();
  baseStore.init(currentUserId, authToken);
  baseStore.setMultiple(oldData, true);
  */
};

const down = async (payload) => {};

export { up, down };
