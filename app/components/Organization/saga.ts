import { call, put, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';
import { LOAD_ORGANIZATION, UPDATE_ORGANIZATION } from './actionTypes';
import * as actions from './actions';
import OrganizationService from '../../backend/organization/organization.service';

const organizationService = new OrganizationService();

function* onLoadingSuccess(response) {
  if (response.status === 200) {
    yield put(actions.loadOrganizationSuccess(response));
  } else if (response.status === 204) {
    const emptyOrganization = { id: 0, name: '' };
    yield put(actions.loadOrganizationSuccess(emptyOrganization));
  }
}

function* onLoadingFailure(error: Record<string, any>) {
  yield put(actions.loadOrganizationFailure(error));
}

export function* startLoadingOrganization() {
  try {
    const response = yield call([organizationService, organizationService.get]);
    yield call(onLoadingSuccess, response);
  } catch (error) {
    yield error && call(onLoadingFailure, error);
  }
}

function* onUpdatingSuccess(response) {
  notification.success({
    message: 'Organization name',
    description: 'Organization name changed successfully'
  });
  yield put(actions.updateOrganizationSuccess(response));
}

function* onUpdatingFailure(error: Record<string, any>) {
  notification.error({ message: 'Error', description: error.message });
  yield put(actions.updateOrganizationFailure(error));
}

export function* startUpdatingOrganization(action) {
  try {
    const response = yield call([organizationService, organizationService.update], { name: action.payload });
    yield call(onUpdatingSuccess, response);
  } catch (error) {
    yield error && call(onUpdatingFailure, error);
  }
}

export default function* organizationActions() {
  yield takeLatest(LOAD_ORGANIZATION, startLoadingOrganization);
  yield takeLatest(UPDATE_ORGANIZATION, startUpdatingOrganization);
}
