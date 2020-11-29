import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Switch, Route} from 'react-router-dom';
import styled from 'styled-components';

import { Loader } from 'common/components';
import Dashboard from '../Dashboard';
import SettingsPage from '../SettingsPage';
import Header from '../common/Header';

import { loadWallet } from '../Wizard/actions';
import * as wizardSelectors from '../Wizard/selectors';
import wizardSaga from '../Wizard/saga';

import { keyvaultLoadLatestVersion } from '../KeyVaultManagement/actions';
import * as keyvaultSelectors from '../KeyVaultManagement/selectors';
import walletSaga from '../KeyVaultManagement/saga';

import useAccounts from 'components/Accounts/useAccounts';
import useVersions from 'components/Versions/useVersions';
import useEventLogs from 'components/EventLogs/useEventLogs';
import useProcessRunner from 'components/ProcessRunner/useProcessRunner';

import * as actionsFromDashboard from '../Dashboard/actions';
import { MODAL_TYPES } from '../Dashboard/constants';

import { useInjectSaga } from '../../utils/injectSaga';
import Store from 'backend/common/store-manager/store';

const wizardKey = 'wizard';
const walletKey = 'keyvaultManagement';

const Wrapper = styled.div`
  width: 100%;
  min-height:100%;
  padding-top: 70px;
  background-color: #f7fcff;
`;

const Content = styled.div`
  width: 100%;
  max-width: 1360px;
  margin: auto;
  display: flex;
`;

const EntryPage = (props: Props) => {
  const {
    callLoadWallet, loadWalletLatestVersion, walletStatus,
    isLoadingWallet, walletErorr, keyvaultCurrentVersion,
    keyvaultLatestVersion, isLoadingKeyvault, keyvaultError, dashboardActions,
  } = props;

  const { setModalDisplay } = dashboardActions;

  useInjectSaga({key: wizardKey, saga: wizardSaga, mode: ''});
  useInjectSaga({key: walletKey, saga: walletSaga, mode: ''});

  const { accounts, isLoadingAccounts } = useAccounts();
  const { bloxLiveNeedsUpdate, isLoadingBloxLiveVersion } = useVersions();
  const { eventLogs, isLoadingEventLogs } = useEventLogs();
  const { processData, error, clearProcessState } = useProcessRunner();

  useEffect(() => {
    const store: Store = Store.getStore();
    const withAccountRecovery = store.exists('accountRecovery');
    const inForgotPasswordProcess = store.get('inForgotPasswordProcess');
    if (withAccountRecovery && inForgotPasswordProcess) {
      setModalDisplay({show: true, type: MODAL_TYPES.FORGOT_PASSWORD});
    }
  }, []);

  useEffect(() => {
    const didntLoadWallet = !walletStatus && !isLoadingWallet && !walletErorr;
    const didntLoadKeyvaultVersion = !keyvaultLatestVersion && !isLoadingKeyvault && !keyvaultError;

    if (processData || error) {
      clearProcessState();
    }
    if (didntLoadKeyvaultVersion) {
      loadWalletLatestVersion();
    }
    if (didntLoadWallet) {
      callLoadWallet();
    }
  }, [isLoadingWallet, keyvaultLatestVersion]);

  const walletNeedsUpdate = keyvaultCurrentVersion !== keyvaultLatestVersion;

  const otherProps = {
    walletNeedsUpdate,
    walletStatus,
    isLoadingWallet,
    accounts,
    isLoadingAccounts,
    eventLogs,
    isLoadingEventLogs,
    isLoadingBloxLiveVersion,
    bloxLiveNeedsUpdate
  };

  if (isLoadingWallet || isLoadingAccounts || !keyvaultLatestVersion || isLoadingEventLogs || isLoadingBloxLiveVersion) {
    return <Loader />;
  }
  return (
    <Wrapper>
      <Header withMenu />
      <Content>
        <Switch>
          <Route exact path="/"
            render={(renderProps) => (<Dashboard {...renderProps} {...otherProps} />)}
          />
          <Route path="/settings"
            render={(renderProps) => (<SettingsPage withMenu {...renderProps} {...otherProps} />)}
          />
        </Switch>
      </Content>
    </Wrapper>
  );
};

type Props = {
  walletStatus: string;
  isLoadingWallet: boolean;
  walletErorr: string;
  callLoadWallet: () => void;
  loadWalletLatestVersion: () => void;

  keyvaultCurrentVersion: string;
  keyvaultLatestVersion: string;
  isLoadingKeyvault: boolean;
  keyvaultError: string;

  bloxLiveNeedsUpdate: boolean;
  isLoadingBloxLiveVersion: boolean;

  dashboardActions: Record<string, any>;
};

const mapStateToProps = (state: State) => ({
  walletStatus: wizardSelectors.getWalletStatus(state),
  isLoadingWallet: wizardSelectors.getIsLoading(state),
  walletErorr: wizardSelectors.getWalletError(state),

  keyvaultCurrentVersion: wizardSelectors.getWalletVersion(state),
  keyvaultLatestVersion: keyvaultSelectors.getLatestVersion(state),
  isLoadingKeyvault: keyvaultSelectors.getIsLoading(state),
  keyvaultError: keyvaultSelectors.getError(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  callLoadWallet: () => dispatch(loadWallet()),
  loadWalletLatestVersion: () => dispatch(keyvaultLoadLatestVersion()),
  dashboardActions: bindActionCreators(actionsFromDashboard, dispatch),
});

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(EntryPage);
