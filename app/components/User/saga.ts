import { call, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from './actionTypes';
import * as actions from './actions';

import UsersService from 'backend/services/users/users.service';

const usersService = new UsersService();

function* loadUserInfoSaga() {
  try {
    const userInfo = yield call([usersService, 'get']);
    yield put(actions.loadUserInfoSuccess(userInfo));
  } catch (error) {
    yield error && put(actions.loadUserInfoFailure(error));
  }
}

function* updateUserInfoSaga(action) {
  const { payload } = action;
  try {
    yield call([usersService, 'update'], payload);
    yield put(actions.updateUserInfoSuccess());
  } catch (error) {
    yield error && put(actions.updateUserInfoFailure(error));
  }
}

export default function* userSaga() {
  yield takeLatest(actionTypes.LOAD_USER_INFO, loadUserInfoSaga);
  yield takeLatest(actionTypes.UPDATE_USER_INFO, updateUserInfoSaga);
}
