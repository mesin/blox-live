import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { notification } from 'antd';

import { LOGIN_INIT, LOGIN_SET_SESSION, LOGOUT } from './actionTypes';
import { setIdToken, loginSuccess, loginFailure } from './actions';
import Auth from '../Auth';
import { saveLastConnection } from 'common/service';
import { updateUserInfo } from 'components/User/actions';

import { version } from 'package.json';
import { getOsVersion } from 'utils/service';

const auth = new Auth();

function* onLoginSuccess(authResult) {
  const { idToken, idTokenPayload } = authResult;
  const userInfo = { os: getOsVersion(), appVersion: version };
  yield put(updateUserInfo(userInfo));

  yield put(setIdToken(idToken));
  yield put(loginSuccess(idTokenPayload));
  yield put(push('/'));
}

function* onLoginFailure(error: Record<string, any>) {
  yield put(loginFailure(error.message));
  if (error.message) {
    notification.error({ message: 'Error', description: 'login failure' });
  }
  yield put(push('/login'));
}

export function* startLogin(action) {
  const { payload } = action;
  yield call(auth.loginFromBrowser, payload);
}

export function* setLoginSession(action) {
  const { payload } = action;
  try {
    const authResult = yield call(auth.handleCallBackFromBrowser, payload);
    yield call(onLoginSuccess, authResult);
  } catch (error) {
    yield error && call(onLoginFailure, error);
  }
}

export function* startLogOut() {
  yield saveLastConnection();
  yield call(auth.logout);
  yield put(push('/login'));
}

export default function* loginSaga() {
  yield takeLatest(LOGIN_INIT, startLogin);
  yield takeLatest(LOGIN_SET_SESSION, setLoginSession);
  yield takeLatest(LOGOUT, startLogOut);
}
