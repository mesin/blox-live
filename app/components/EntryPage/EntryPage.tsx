import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import styled from 'styled-components';

import {Loader} from 'common/components';
import Dashboard from '../Dashboard';
import SettingsPage from '../SettingsPage';
import Header from '../common/Header';

import electron from 'electron';

import {loadWallet} from '../Wizard/actions';
import * as wizardSelectors from '../Wizard/selectors';
import wizardSaga from '../Wizard/saga';

import {loadAccounts} from '../Accounts/actions';
import * as accountsSelectors from '../Accounts/selectors';
import accountsSaga from '../Accounts/saga';

import { keyvaultLoadLatestVersion } from '../KeyVaultManagement/actions';
import {getLatestVersion} from '../KeyVaultManagement/selectors';
import walletSaga from '../KeyVaultManagement/saga';

import organizationSaga from '../Organization/saga';
import * as organizationSelectors from '../Organization/selectors';
import {loadEventLogs} from '../Organization/actions';

import versionsSaga from '../Versions/saga';
import * as versionsSelectors from '../Versions/selectors';
import {loadBloxLiveVersion} from '../Versions/actions';

import {useInjectSaga} from '../../utils/injectSaga';

const wizardKey = 'wizard';
const accountsKey = 'accounts';
const walletKey = 'keyvaultManagement';
const organizationKey = 'organization';
const versionsKey = 'versions';

const Wrapper = styled.div`
  width: 100%;
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
    walletCurrentVersion,
    walletLatestVersion,
    isLoadingWallet,
    walletErorr,
    callLoadAllAccounts,
    accounts,
    isLoadingAccounts,
    accountsErorr,
    callLoadEventLogs,
    eventLogs,
    isLoadingEventLogs,
    eventLogsError,

    callLoadBloxLiveVersion,
    bloxLiveLatestVersion,
    isLoadingBloxLiveVersion,
    bloxLiveVersionError,
  } = props;

  useInjectSaga({key: wizardKey, saga: wizardSaga, mode: ''});
  useInjectSaga({key: accountsKey, saga: accountsSaga, mode: ''});
  useInjectSaga({key: walletKey, saga: walletSaga, mode: ''});
  useInjectSaga({key: organizationKey, saga: organizationSaga, mode: ''});
  useInjectSaga({key: versionsKey, saga: versionsSaga, mode: ''});

  useEffect(() => {
    const didntLoadWallet = !walletStatus && !isLoadingWallet && !walletErorr;
    const didntLoadAccounts = !accounts && !isLoadingAccounts && !accountsErorr;
    const didntLoadEventLogs = !eventLogs && !isLoadingEventLogs && !eventLogsError;
    const didntLoadVersions = !bloxLiveLatestVersion && !isLoadingBloxLiveVersion && !bloxLiveVersionError;

    if (!walletLatestVersion && !walletErorr) {
      loadWalletLatestVersion();
    }
    if (didntLoadWallet) {
      callLoadWallet();
    }
    if (didntLoadAccounts) {
      callLoadAllAccounts();
    }
    if (didntLoadEventLogs) {
      callLoadEventLogs();
    }

    if (didntLoadVersions) {
      callLoadBloxLiveVersion();
    }
  }, [isLoadingWallet, isLoadingAccounts, walletLatestVersion, isLoadingEventLogs, isLoadingBloxLiveVersion]);

  const walletNeedsUpdate = walletCurrentVersion !== walletLatestVersion;

  const bloxLiveCurrentVersion = electron.remote.app.getVersion();
  const bloxLiveNeedsUpdate = bloxLiveCurrentVersion !== bloxLiveLatestVersion;

  const otherProps = {
    walletNeedsUpdate,
    walletStatus,
    isLoadingWallet,
    accounts,
    isLoadingAccounts,
    eventLogs,
    isLoadingEventLogs,
    bloxLiveLatestVersion,
    isLoadingBloxLiveVersion,
    bloxLiveNeedsUpdate
  };

  if (isLoadingWallet || isLoadingAccounts || !walletLatestVersion || isLoadingEventLogs || isLoadingBloxLiveVersion) {
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

  walletCurrentVersion: string;
  walletLatestVersion: string;

  accounts: [];
  isLoadingAccounts: boolean;
  accountsErorr: string;
  callLoadAllAccounts: () => void;

  eventLogs: [];
  isLoadingEventLogs: boolean;
  eventLogsError: string;
  callLoadEventLogs: () => void;

  bloxLiveLatestVersion: string;
  isLoadingBloxLiveVersion: boolean;
  bloxLiveVersionError: string;
  callLoadBloxLiveVersion: () => void;
};

const mapStateToProps = (state: State) => ({
  walletStatus: wizardSelectors.getWalletStatus(state),
  isLoadingWallet: wizardSelectors.getIsLoading(state),
  walletErorr: wizardSelectors.getWalletError(state),
  walletCurrentVersion: wizardSelectors.getWalletVersion(state),
  walletLatestVersion: getLatestVersion(state),

  accounts: accountsSelectors.getAccounts(state),
  isLoadingAccounts: accountsSelectors.getAccountsLoadingStatus(state),
  accountsErorr: accountsSelectors.getAccountsError(state),

  eventLogs: organizationSelectors.getEventLogs(state.organization),
  isLoadingEventLogs: organizationSelectors.getEventLogsLoadingStatus(state.organization),
  eventLogsError: organizationSelectors.getEventLogsError(state.organization),

  bloxLiveLatestVersion: versionsSelectors.getLatestBloxLiveVersion(state),
  isLoadingBloxLiveVersion: versionsSelectors.getLatestBloxLiveVersionLoadingStatus(state),
  bloxLiveVersionError: versionsSelectors.getLatestBloxLiveVersionError(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  callLoadWallet: () => dispatch(loadWallet()),
  callLoadAllAccounts: () => dispatch(loadAccounts()),
  loadWalletLatestVersion: () => dispatch(keyvaultLoadLatestVersion()),
  callLoadEventLogs: () => dispatch(loadEventLogs()),
  callLoadBloxLiveVersion: () => dispatch(loadBloxLiveVersion())
});

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(EntryPage);
