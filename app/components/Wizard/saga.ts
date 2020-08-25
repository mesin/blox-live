import { call, put, select, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';
import { LOAD_WALLET, LOAD_DEPOSIT_DATA, UPDATE_ACCOUNT_STATUS } from './actionTypes';
import * as actions from './actions';
import { getData } from '../ProcessRunner/selectors';
import AccountKeyVaultService from '../../backend/account/account-key-vault.service';
import WalletService from '../../backend/wallet/wallet.service';
import AccountService from '../../backend/account/account.service';

const walletService = new WalletService();
const accountService = new AccountService();
const accountKeyVaultService = new AccountKeyVaultService();

function* onAccountStatusUpdateSuccess() {
  yield put(actions.updateAccountStatusSuccess());
}

function* onAccountStatusUpdateFailure(error) {
  yield put(actions.updateAccountStatusFailure(error));
  notification.error({ message: 'Error', description: error.message });
}

function* onLoadWalletSuccess(response) {
  yield put(actions.loadWalletSuccess(response));
}

function* onLoadWalletFailure(error) {
  yield put(actions.loadWalletFailure(error));
  notification.error({ message: 'Error', description: error.message });
}

function* onLoadDepositDataSuccess(response) {
  yield put(actions.loadDepositDataSuccess(response));
}

function* onLoadDepositDataFailure(error) {
  yield put(actions.loadDepositDataFailure(error));
  notification.error({ message: 'Error', description: error.message });
}

function* loadWallet() {
  try {
    const response = yield call(walletService.get);
    console.log(response);
    yield call(onLoadWalletSuccess, response);
  } catch (error) {
    yield error && call(onLoadWalletFailure, error);
  }
}

function* loadDepositData() {
  const accountData = yield select(getData);
  const { publicKey } = accountData;
  try {
    const response = yield call(accountKeyVaultService.getDepositData, publicKey);
    yield call(onLoadDepositDataSuccess, response);
  } catch (error) {
    yield error && call(onLoadDepositDataFailure, error);
  }
}

function* startUpdatingAccountStatus(action) {
  const { payload } = action;
  try {
    yield call(accountService.updateStatus, payload, { deposited: true });
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
