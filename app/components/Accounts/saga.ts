import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { notification } from 'antd';

import { LOAD_ACCOUNTS, DELETE_ACCOUNT } from './actionTypes';
import * as actions from './actions';

function* onLoadingSuccess(response: Record<string, any>) {
  yield put(actions.loadAccountsSuccess(response.data));
}

function* onLoadingFailure(error: Record<string, any>) {
  notification.error({ message: 'Error', description: error.message });
  yield put(actions.loadAccountsFailure(error.response.data));
}

function* onDeleteSuccess() {
  yield put(actions.deleteAccountSuccess());
}

function* onDeleteFailure(error: Record<string, any>) {
  notification.error({ message: 'Error', description: error.message });
  yield put(actions.deleteAccountFailure(error.response.data));
}

export function* startLoadingAccounts() {
  try {
    const url = `${process.env.API_URL}/accounts`;
    const response = yield call(axios.get, url);
    yield call(onLoadingSuccess, response);
  } catch (error) {
    yield error && call(onLoadingFailure, error);
  }
}

export function* deleteAccount(action: Record<string, any>) {
  const { payload } = action;
  try {
    const url = `${process.env.API_URL}/accounts/${payload}`;
    yield call(axios.delete, url);
    yield call(onDeleteSuccess);
  } catch (error) {
    yield error && call(onDeleteFailure, error);
  }
}

export default function* accountsActions() {
  yield takeLatest(DELETE_ACCOUNT, deleteAccount);
  yield takeLatest(LOAD_ACCOUNTS, startLoadingAccounts);
}
