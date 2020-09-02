import { call, put, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';

import { LOAD_ACCOUNTS } from './actionTypes';
import * as actions from './actions';
import AccountService from '../../backend/account/account.service';

const accountService = new AccountService();

function* onLoadingSuccess(response: Record<string, any>) {
  yield put(actions.loadAccountsSuccess(response));
}

function* onLoadingFailure(error: Record<string, any>) {
  notification.error({ message: 'Error', description: error.message });
  yield put(actions.loadAccountsFailure(error.response.data));
}

export function* startLoadingAccounts() {
  try {
    const response = yield call([accountService, accountService.get]);
    yield call(onLoadingSuccess, response);
  } catch (error) {
    yield error && call(onLoadingFailure, error);
  }
}

export default function* accountsActions() {
  yield takeLatest(LOAD_ACCOUNTS, startLoadingAccounts);
}
