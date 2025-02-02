import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';

import { Loader } from '../../common/components';
import Login from '../Login';
import Settings from '../SettingsPage';
import NotFoundPage from '../NotFoundPage';
import Wizard from '../Wizard';
import EntryPage from '../EntryPage';
import TestPage from '../Test';

import { useInjectSaga } from '../../utils/injectSaga';
import { onWindowClose } from 'common/service';
import { isPrimaryDevice, inRecoveryProcess, inForgotPasswordProcess } from './service';
import { allAccountsDeposited } from '../Accounts/service';

// wallet
import { loadWallet, setFinishedWizard } from '../Wizard/actions';
import {
  getWalletStatus,
  getIsLoading as getIsLoadingWallet,
  getWalletError,
  getWizardFinishedStatus,
} from '../Wizard/selectors';
import wizardSaga from '../Wizard/saga';

// accounts
import { loadAccounts } from '../Accounts/actions';
import {
  getAccounts,
  getAccountsLoadingStatus,
  getAccountsError,
  getAddAnotherAccount
} from '../Accounts/selectors';
import accountsSaga from '../Accounts/saga';

// websocket
import { connectToWebSockets } from '../WebSockets/actions';
import {
  getIsConnected,
  getIsLoading as getIsLoadingWebsocket,
  getError as getWebSocketError,
} from '../WebSockets/selectors';
import webSocketSaga from '../WebSockets/saga';

// user
import * as actionsFromUser from '../User/actions';
import * as userSelectors from '../User/selectors';
import userSaga from '../User/saga';

import { ModalsManager } from 'components/Dashboard/components';
import Connection from 'backend/common/store-manager/connection';

const wizardKey = 'wizard';
const accountsKey = 'accounts';
const websocketKey = 'websocket';
const userKey = 'user';

const LoggedIn = (props: Props) => {
  useInjectSaga({ key: wizardKey, saga: wizardSaga, mode: '' });
  useInjectSaga({ key: accountsKey, saga: accountsSaga, mode: '' });
  useInjectSaga({ key: websocketKey, saga: webSocketSaga, mode: '' });
  useInjectSaga({ key: userKey, saga: userSaga, mode: '' });

  const {
    isFinishedWizard, callSetFinishedWizard, walletStatus,
    isLoadingWallet, walletError, callLoadWallet,
    accounts, addAnotherAccount, isLoadingAccounts, accountsError, callLoadAccounts, callConnectToWebSockets, isWebsocketLoading,
    websocket, webSocketError, userInfo, userInfoError, isLoadingUserInfo, userActions
  } = props;

  const { loadUserInfo } = userActions;

  const [isFinishLoadingAll, toggleFinishLoadingAll] = useState(false);

  useEffect(() => {
    callLoadWallet();
    callLoadAccounts();
    loadUserInfo();
    callConnectToWebSockets();
  }, []);

  useEffect(() => {
    const allDataIsReady = !!walletStatus && !!accounts && !!websocket && !!userInfo;
    const noErrors = !walletError && !accountsError && !webSocketError && !userInfoError;
    const doneLoading = !isLoadingWallet && !isLoadingAccounts && !isWebsocketLoading && !isLoadingUserInfo;

    if (allDataIsReady && noErrors && doneLoading) {
      const storedUuid = Connection.db().exists('uuid');
      const hasWallet = walletStatus === 'active' || walletStatus === 'offline';
      const shouldNavigateToDashboard = hasWallet && accounts.length > 0 && allAccountsDeposited(accounts) && !addAnotherAccount;

      if (inForgotPasswordProcess()) {
        callSetFinishedWizard(true);
      }

      if ((!userInfo.uuid && storedUuid) || (isPrimaryDevice(userInfo.uuid) && !inRecoveryProcess())) {
        shouldNavigateToDashboard && callSetFinishedWizard(true);
      }

      toggleFinishLoadingAll(true);
      onWindowClose();
    }
  }, [walletStatus, accounts, websocket, userInfo, isFinishedWizard]);

  if (!isFinishLoadingAll) {
    return <Loader />;
  }

  return (
    <>
      <Switch>
        <Route exact path="/" render={(routeProps) => isFinishedWizard ? <EntryPage {...routeProps} /> : <Wizard />} />
        <Route path="/login" component={Login} />
        <Route path="/test" component={TestPage} />
        <Route path="/settings/:path" render={(routeProps) => <Settings {...routeProps} withMenu />} />
        <Redirect from="/settings" to="/settings/general" />
        <Route path="" component={NotFoundPage} />
      </Switch>
      <ModalsManager />
    </>
  );
};

const mapStateToProps = (state: State) => ({
  // wallet
  walletStatus: getWalletStatus(state),
  isLoadingWallet: getIsLoadingWallet(state),
  walletError: getWalletError(state),

  // accounts
  accounts: getAccounts(state),
  isLoadingAccounts: getAccountsLoadingStatus(state),
  accountsError: getAccountsError(state),
  addAnotherAccount: getAddAnotherAccount(state),

  // websocket
  websocket: getIsConnected(state),
  isWebsocketLoading: getIsLoadingWebsocket(state),
  webSocketError: getWebSocketError(state),

  // user
  userInfo: userSelectors.getInfo(state),
  isLoadingUserInfo: userSelectors.getLoadingStatus(state),
  userInfoError: userSelectors.getError(state),

  isFinishedWizard: getWizardFinishedStatus(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  callLoadWallet: () => dispatch(loadWallet()),
  callLoadAccounts: () => dispatch(loadAccounts()),
  callConnectToWebSockets: () => dispatch(connectToWebSockets()),
  callSetFinishedWizard: (isFinished: boolean) => dispatch(setFinishedWizard(isFinished)),
  userActions: bindActionCreators(actionsFromUser, dispatch),
});

interface Props extends RouteComponentProps {
  isFinishedWizard: boolean;
  callSetFinishedWizard: (arg0: boolean) => void;

  // wallet
  walletStatus: string;
  isLoadingWallet: boolean;
  walletError: string;
  callLoadWallet: () => void;

  // accounts
  accounts: [];
  isLoadingAccounts: boolean;
  accountsError: string;
  callLoadAccounts: () => void;
  addAnotherAccount: boolean;

  // websocket
  isWebsocketLoading: boolean;
  websocket: boolean;
  webSocketError: string;
  callConnectToWebSockets: () => void;

  // user
  isLoadingUserInfo: boolean;
  userInfo: Record<string, any>;
  userInfoError: string;
  userActions: Record<string, any>;
}

type State = Record<string, any>;

type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoggedIn));
