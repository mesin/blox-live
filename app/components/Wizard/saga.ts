import {call, put, takeLatest} from 'redux-saga/effects';
import {notification} from 'antd';
import {LOAD_WALLET, LOAD_DEPOSIT_DATA, UPDATE_ACCOUNT_STATUS} from './actionTypes';
import * as actions from './actions';
import WalletService from '../../backend/services/wallet/wallet.service';
import AccountService from '../../backend/services/account/account.service';

function* onAccountStatusUpdateSuccess() {
  yield put(actions.updateAccountStatusSuccess());
}

function* onAccountStatusUpdateFailure(error) {
  yield put(actions.updateAccountStatusFailure(error));
  notification.error({message: 'Error', description: error.message});
}

function* onLoadWalletSuccess(response) {
  if (response) {
    yield put(actions.loadWalletSuccess(response));
  }
}

function* onLoadWalletFailure(error) {
  yield put(actions.loadWalletFailure(error));
  notification.error({message: 'Error', description: error.message});
}

function* onLoadDepositDataSuccess(depositData) {
  yield put(actions.loadDepositDataSuccess(depositData));
}

function* onLoadDepositDataFailure(error) {
  yield put(actions.loadDepositDataFailure(error));
  notification.error({message: 'Error', description: error.message});
}

function* loadWallet() {
  try {
    const walletService = new WalletService();
    const response = yield call([walletService, 'get']);
    yield call(onLoadWalletSuccess, response);
  } catch (error) {
    yield error && call(onLoadWalletFailure, error);
  }
}

function* loadDepositData(action) {
  const {payload} = action;
  const {publicKey, accountIndex, network} = payload;
  try {
    const accountService = new AccountService();
    const response = yield call([accountService, 'getDepositData'], publicKey, accountIndex, network);
    yield call(onLoadDepositDataSuccess, response);
  } catch (error) {
    yield error && call(onLoadDepositDataFailure, error);
  }
}

function* startUpdatingAccountStatus(action) {
  const {payload} = action;
  const {accountId, txHash} = payload;
  try {
    const accountService = new AccountService();
    yield call([accountService, 'updateStatus'], accountId, {deposited: true, depositTxHash: txHash});
    yield call(onAccountStatusUpdateSuccess);
  } catch (error) {
    yield error && call(onAccountStatusUpdateFailure, error);
  }
}

export default function* organizationActions() {
  yield takeLatest(LOAD_WALLET, loadWallet);
  yield takeLatest(LOAD_DEPOSIT_DATA, loadDepositData);
  yield takeLatest(UPDATE_ACCOUNT_STATUS, startUpdatingAccountStatus);
}
