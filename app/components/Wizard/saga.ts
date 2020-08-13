import { call, put, select, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { notification } from 'antd';

import { LOAD_WALLET, LOAD_DEPOSIT_DATA } from './actionTypes';
import * as actions from './actions';
import { getAccountId } from './selectors';

function* onLoadWalletSuccess(response) {
  yield put(actions.loadWalletSuccess(response.data));
}

function* onLoadWalletFailure(error) {
  yield put(actions.loadWalletFailure(error));
  notification.error({ message: 'Error', description: error.message });
}

function* onLoadDepositDataSuccess(response) {
  yield put(actions.loadDepositDataSuccess(response.data));
}

function* onLoadDepositDataFailure(error) {
  yield put(actions.loadDepositDataFailure(error));
  notification.error({ message: 'Error', description: error.message });
}

export function* loadWallet() {
  try {
    const url = `${process.env.API_URL}/wallets`;
    const response = yield call(axios.get, url);
    // TODO: handle unauthorized issue

    yield call(onLoadWalletSuccess, response);
  } catch (error) {
    yield error && call(onLoadWalletFailure, error);
  }
}

export function* loadDepositData() {
  const accountId = yield select(getAccountId);
  try {
    const url = `${process.env.API_URL}/accounts/${accountId}/deposit_data`;
    const response = yield call(axios.get, url);
    yield call(onLoadDepositDataSuccess, response);
  } catch (error) {
    yield error && call(onLoadDepositDataFailure, error);
  }
}

export default function* organizationActions() {
  yield takeLatest(LOAD_WALLET, loadWallet);
  yield takeLatest(LOAD_DEPOSIT_DATA, loadDepositData);
}
