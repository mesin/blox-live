import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Switch, Route} from 'react-router-dom';
import styled from 'styled-components';

import {Loader} from '../../common/components';
import Dashboard from '../Dashboard';
import SettingsPage from '../SettingsPage';
import Header from '../common/Header';

import {loadWallet} from '../Wizard/actions';
import wizardSaga from '../Wizard/saga';
import * as wizardSelectors from '../Wizard/selectors';

import {loadAccounts} from '../Accounts/actions';
import accountsSaga from '../Accounts/saga';
import * as accountsSelectors from '../Accounts/selectors';

import {kevaultLoadLatestVersion} from '../KeyVaultManagement/actions';
import walletSaga from '../KeyVaultManagement/saga';
import {getLatestVersion} from '../KeyVaultManagement/selectors';

import organizationSaga from '../Organization/saga';
import * as organizationSelectors from '../Organization/selectors';

import {useInjectSaga} from '../../utils/injectSaga';
import {loadEventLogs} from '../Organization/actions';

const wizardKey = 'wizard';
const accountsKey = 'accounts';
const walletKey = 'keyvaultManagement';
const organizationKey = 'organization';

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
  } = props;

  useInjectSaga({key: wizardKey, saga: wizardSaga, mode: ''});
  useInjectSaga({key: accountsKey, saga: accountsSaga, mode: ''});
  useInjectSaga({key: walletKey, saga: walletSaga, mode: ''});
  useInjectSaga({key: organizationKey, saga: organizationSaga, mode: ''});

  useEffect(() => {
    const didntLoadWallet = !walletStatus && !isLoadingWallet && !walletErorr;
    const didntLoadAccounts = !accounts && !isLoadingAccounts && !accountsErorr;
    const didntLoadEventLogs = !eventLogs && !isLoadingEventLogs && !eventLogsError;

    if (!walletLatestVersion) {
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
  }, [isLoadingWallet, isLoadingAccounts, walletLatestVersion, isLoadingEventLogs]);

  const walletNeedsUpdate = walletCurrentVersion !== walletLatestVersion;
  console.log('walletCurrentVersion', walletCurrentVersion);
  console.log('walletLatestVersion', walletLatestVersion);

  const otherProps = {
    walletNeedsUpdate,
    walletStatus,
    isLoadingWallet,
    accounts,
    isLoadingAccounts,
    eventLogs,
    isLoadingEventLogs,
  };

  if (isLoadingWallet || isLoadingAccounts || !walletLatestVersion || isLoadingEventLogs) {
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
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  callLoadWallet: () => dispatch(loadWallet()),
  callLoadAllAccounts: () => dispatch(loadAccounts()),
  loadWalletLatestVersion: () => dispatch(kevaultLoadLatestVersion()),
  callLoadEventLogs: () => dispatch(loadEventLogs()),
});

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(EntryPage);
