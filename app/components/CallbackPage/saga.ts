import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { notification } from 'antd';

import { LOGIN_INIT } from './actionTypes';
import { setIdToken, loginSuccess, loginFailure } from './actions';
import Auth from '../Auth';

const auth = new Auth();

function* onSuccess(authResult) {
  const { idToken, idTokenPayload } = authResult;
  yield put(setIdToken(idToken));
  yield put(loginSuccess(idTokenPayload));
  yield put(push('/'));
}

function* onFailure(error: Record<string, any>) {
  yield put(loginFailure(error));
  notification.error({ message: 'Error', description: error.message });
  yield put(push('/login'));
}

export function* startLogin() {
  try {
    const authResult = yield call(auth.handleAuthentication);
    yield call(onSuccess, authResult);
  } catch (error) {
    yield error && call(onFailure, error);
  }
}

export default function* userData() {
  yield takeLatest(LOGIN_INIT, startLogin);
}
