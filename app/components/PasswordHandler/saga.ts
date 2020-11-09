import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as actions from './actions';
import Store from 'backend/common/store-manager/store';

import { notification } from 'antd';

const store: Store = Store.getStore();

function* savePassword(action) {
  const { payload } = action;
  try {
    yield call([store, 'setCryptoKey'], payload);
    yield put(actions.savePasswordSuccess());
  }
  catch (error) {
    yield put(actions.savePasswordFailure(error.message));
    notification.error({ message: 'Error', description: error.message });
  }
}

function* replacePassword(action) {
  const { payload } = action;
  try {
    yield call([store, 'setNewPassword'], payload);
    yield put(actions.savePasswordSuccess());
  }
  catch (error) {
    yield put(actions.savePasswordFailure(error.message));
    notification.error({ message: 'Error', description: error.message });
  }
}

function* validatePassword(action) {
  const { payload } = action;
  const isValid = yield call([store, 'isCryptoKeyValid'], payload);
  if (isValid) {
    yield call([store, 'setCryptoKey'], payload);
  }
  yield put(actions.setPasswordValidation(isValid));
}

export default function* passwordHandlerSaga() {
  yield takeLatest(actionTypes.SAVE_PASSWORD, savePassword);
  yield takeLatest(actionTypes.REPLACE_PASSWORD, replacePassword);
  yield takeLatest(actionTypes.CHECK_PASSWORD_VALIDATION, validatePassword);
}
