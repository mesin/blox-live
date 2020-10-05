import React, {useEffect} from 'react';
import {connect} from 'react-redux';
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

import organizationSaga from '../Organization/saga';
import * as organizationSelectors from '../Organization/selectors';
import {loadEventLogs} from '../Organization/actions';

import processRunnerSaga from '../ProcessRunner/saga';
import * as processRunnerSelectors from '../ProcessRunner/selectors';
import { processClearState } from '../ProcessRunner/actions';

import useAccounts from 'components/Accounts/useAccounts';
import useVersions from 'components/Versions/useVersions';
import { useInjectSaga } from '../../utils/injectSaga';

const wizardKey = 'wizard';
const walletKey = 'keyvaultManagement';
const organizationKey = 'organization';
const processRunnerKey = 'processRunner';

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
    callLoadWallet,
    loadWalletLatestVersion,
    walletStatus,
    isLoadingWallet,
    walletErorr,
    keyvaultCurrentVersion,
    keyvaultLatestVersion,
    isLoadingKeyvault,
    keyvaultError,
    callLoadEventLogs,
    eventLogs,
    isLoadingEventLogs,
    eventLogsError,
    processRunnerData,
    callProcessClearState,
  } = props;

  useInjectSaga({key: wizardKey, saga: wizardSaga, mode: ''});
  useInjectSaga({key: walletKey, saga: walletSaga, mode: ''});
  useInjectSaga({key: organizationKey, saga: organizationSaga, mode: ''});
  useInjectSaga({key: processRunnerKey, saga: processRunnerSaga, mode: ''});

  const { accounts, isLoadingAccounts } = useAccounts();
  const { bloxLiveNeedsUpdate, isLoadingBloxLiveVersion } = useVersions();

  useEffect(() => {
    const didntLoadWallet = !walletStatus && !isLoadingWallet && !walletErorr;
    const didntLoadEventLogs = !eventLogs && !isLoadingEventLogs && !eventLogsError;
    const didntLoadKeyvaultVersion = !keyvaultLatestVersion && !isLoadingKeyvault && !keyvaultError;

    if (processRunnerData) {
      callProcessClearState();
    }
    if (didntLoadKeyvaultVersion) {
      loadWalletLatestVersion();
    }
    if (didntLoadWallet) {
      callLoadWallet();
    }
    if (didntLoadEventLogs) {
      callLoadEventLogs();
    }
  }, [isLoadingWallet, keyvaultLatestVersion, isLoadingEventLogs]);

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

  accounts: [];
  isLoadingAccounts: boolean;
  accountsErorr: string;

  bloxLiveNeedsUpdate: boolean;
  isLoadingBloxLiveVersion: boolean;

  eventLogs: [];
  isLoadingEventLogs: boolean;
  eventLogsError: string;
  callLoadEventLogs: () => void;

  processRunnerData: Record<string, any> | null,
  callProcessClearState: () => void;
};

const mapStateToProps = (state: State) => ({
  walletStatus: wizardSelectors.getWalletStatus(state),
  isLoadingWallet: wizardSelectors.getIsLoading(state),
  walletErorr: wizardSelectors.getWalletError(state),

  keyvaultCurrentVersion: wizardSelectors.getWalletVersion(state),
  keyvaultLatestVersion: keyvaultSelectors.getLatestVersion(state),
  isLoadingKeyvault: keyvaultSelectors.getIsLoading(state),
  keyvaultError: keyvaultSelectors.getError(state),

  eventLogs: organizationSelectors.getEventLogs(state.organization),
  isLoadingEventLogs: organizationSelectors.getEventLogsLoadingStatus(state.organization),
  eventLogsError: organizationSelectors.getEventLogsError(state.organization),

  processRunnerData: processRunnerSelectors.getData(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  callLoadWallet: () => dispatch(loadWallet()),
  loadWalletLatestVersion: () => dispatch(keyvaultLoadLatestVersion()),
  callLoadEventLogs: () => dispatch(loadEventLogs()),
  callProcessClearState: () => dispatch(processClearState()),
});

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(EntryPage);
