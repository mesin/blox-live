import { call, put, select, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { notification } from 'antd';

import {
  CREATE_ONE_TIME_PASS,
  LOAD_WALLET,
  GENERATE_VALIDATOR_KEY,
  LOAD_DEPOSIT_DATA,
} from './actionTypes';
import * as actions from './actions';
import { getAccountId } from './selectors';

function* onLoadWalletSuccess(response) {
  yield put(actions.loadWalletSuccess(response.data));
}

function* onLoadWalletFailure(error) {
  yield put(actions.loadWalletFailure(error));
  notification.error({ message: 'Error', description: error.message });
}

function* onCreateOtpSuccess(response) {
  yield put(actions.createOneTimePassSuccess(response.data));
}

function* onCreateOtpFailure(error) {
  yield put(actions.createOneTimePassFailure(error));
  notification.error({ message: 'Error', description: error.message });
}

function* onGenerateValidatorSuccess(response) {
  yield put(actions.generateValidatorKeySuccess(response.data));
}

function* onGenerateValidatorFailure(error) {
  yield put(actions.generateValidatorKeyFailure(error));
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

export function* createOTP(action) {
  try {
    const url = `${process.env.API_URL}/organizations/otp`;
    const response = yield call(axios.post, url, { name: action.payload });
    yield call(onCreateOtpSuccess, response);
  } catch (error) {
    yield error && call(onCreateOtpFailure, error);
  }
}

export function* generateValidatorKey(action) {
  try {
    const url = `${process.env.API_URL}/accounts`;
    const response = yield call(axios.post, url, { name: action.payload });
    yield call(onGenerateValidatorSuccess, response);
  } catch (error) {
    yield error && call(onGenerateValidatorFailure, error);
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
  yield takeLatest(CREATE_ONE_TIME_PASS, createOTP);
  yield takeLatest(LOAD_WALLET, loadWallet);
  yield takeLatest(GENERATE_VALIDATOR_KEY, generateValidatorKey);
  yield takeLatest(LOAD_DEPOSIT_DATA, loadDepositData);
}
