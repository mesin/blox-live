import { useDispatch } from 'react-redux';
import Store from 'backend/common/store-manager/store';

import { setModalDisplay } from '../Dashboard/actions';
import { MODAL_TYPES } from '../Dashboard/constants';

const store: Store = Store.getStore();

const usePasswordHandler = () => {
  const dispatch = useDispatch();

  const checkIfPasswordIsNeeded = (onSuccess: onSuccess) => {
    if (!store.isCryptoKeyStored()) {
      return dispatch(setModalDisplay({ show: true, type: MODAL_TYPES.PASSWORD, text: '', onSuccess}));
    }
    return onSuccess();
  };
  return { checkIfPasswordIsNeeded };
};

type onSuccess = () => void;

export default usePasswordHandler;
