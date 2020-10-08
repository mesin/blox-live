import { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import * as selectors from './selectors';
import { loadAccounts } from './actions';
import saga from './saga';
import { useInjectSaga } from 'utils/injectSaga';

const { getAccounts, getAccountsLoadingStatus, getAccountsError } = selectors;

const useAccounts = () => {
  useInjectSaga({key: 'accounts', saga, mode: ''});

  const accounts: [] = useSelector(getAccounts, shallowEqual);
  const isLoadingAccounts: boolean = useSelector(getAccountsLoadingStatus, shallowEqual);
  const accountsErorr: string = useSelector(getAccountsError, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!accounts && !isLoadingAccounts && !accountsErorr) {
      dispatch(loadAccounts());
    }
  }, [isLoadingAccounts]);

  return { accounts, isLoadingAccounts, accountsErorr };
};

export default useAccounts;
