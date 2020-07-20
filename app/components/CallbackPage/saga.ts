import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { notification } from 'antd';

import { LOGIN_INIT, CHECK_IF_TOKEN_EXIST } from './actionTypes';
import { setIdToken, loginSuccess, loginFailure } from './actions';
import Auth from '../Auth';

const auth = new Auth();

function* onLoginSuccess(authResult) {
  const { idToken, idTokenPayload } = authResult;
  yield put(setIdToken(idToken));
  yield put(loginSuccess(idTokenPayload));
  yield put(push('/'));
}

function* onLoginFailure(error: Record<string, any>) {
  yield put(loginFailure(error));
  notification.error({ message: 'Error', description: error.message });
  yield put(push('/login'));
}

export function* startLogin(action) {
  const { payload } = action;
  try {
    const authResult = yield call(auth.loginWithSocialApp, payload);
    yield call(onLoginSuccess, authResult);
  } catch (error) {
    yield error && call(onLoginFailure, error);
  }
}

export function* checkIfTokenExist() {
  try {
    const authResult = yield call(auth.checkIfTokensExist);
    yield call(onLoginSuccess, authResult);
  } catch (error) {
    yield error && call(onLoginFailure, error);
  }
}

export default function* userData() {
  yield takeLatest(CHECK_IF_TOKEN_EXIST, checkIfTokenExist);
  yield takeLatest(LOGIN_INIT, startLogin);
}
