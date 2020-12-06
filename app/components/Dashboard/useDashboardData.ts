import { useDispatch } from 'react-redux';
import { useInjectSaga } from 'utils/injectSaga';

import { loadAccounts } from '../Accounts/actions';
import accountSaga from '../Accounts/saga';

import { loadBloxLiveVersion } from '../Versions/actions';
import versionsSaga from '../Versions/saga';

import { loadWallet } from '../Wizard/actions';
import wizardSaga from '../Wizard/saga';

import { loadEventLogs } from '../EventLogs/actions';
import eventLogsSaga from '../EventLogs/saga';

import { keyvaultLoadLatestVersion } from '../KeyVaultManagement/actions';
import walletSaga from '../KeyVaultManagement/saga';

import { saveLastConnection } from 'common/service';

const useDashboardData = () => {
  useInjectSaga({key: 'wizard', saga: wizardSaga, mode: ''});
  useInjectSaga({key: 'accounts', saga: accountSaga, mode: ''});
  useInjectSaga({key: 'keyvaultManagement', saga: walletSaga, mode: ''});
  useInjectSaga({key: 'versions', saga: versionsSaga, mode: ''});
  useInjectSaga({key: 'eventLogs', saga: eventLogsSaga, mode: ''});

  const dispatch = useDispatch();

  const loadDashboardData = async () => {
    await saveLastConnection();
    await dispatch(loadWallet());
    await dispatch(loadAccounts());
    await dispatch(keyvaultLoadLatestVersion());
    await dispatch(loadBloxLiveVersion());
    await dispatch(loadEventLogs());
  };

  return { loadDashboardData };
};

export default useDashboardData;
