import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { notification } from 'antd';

import { LOAD_ORGANIZATION, UPDATE_ORGANIZATION } from './actionTypes';
import * as actions from './actions';

function* onLoadingSuccess(response) {
  if (response.status === 200) {
    yield put(actions.loadOrganizationSuccess(response.data));
  } else if (response.status === 204) {
    const emptyOrganzation = { id: 0, name: '' };
    yield put(actions.loadOrganizationSuccess(emptyOrganzation));
  }
}

function* onLoadingFailure(error: Record<string, any>) {
  yield put(actions.loadOrganizationFailure(error));
}

export function* startLoadingOrganization() {
  try {
    const url = `${process.env.API_URL}/organizations/profile`;
    const response = yield call(axios.get, url);
    yield call(onLoadingSuccess, response);
  } catch (error) {
    yield error && call(onLoadingFailure, error);
  }
}

function* onUpdatingSuccess(response) {
  notification.success({
    message: 'Organization name',
    description: 'Organization name changed successfully',
  });
  yield put(actions.updateOrganizationSuccess(response.data));
}

function* onUpdatingFailure(error: Record<string, any>) {
  notification.error({ message: 'Error', description: error.message });
  yield put(actions.updateOrganizationFailure(error));
}

export function* startUpdatingOrganization(action) {
  try {
    const url = `${process.env.API_URL}/organizations/profile`;
    const response = yield call(axios.patch, url, { name: action.payload });
    yield call(onUpdatingSuccess, response);
  } catch (error) {
    yield error && call(onUpdatingFailure, error);
  }
}

export default function* organizationActions() {
  yield takeLatest(LOAD_ORGANIZATION, startLoadingOrganization);
  yield takeLatest(UPDATE_ORGANIZATION, startUpdatingOrganization);
}
