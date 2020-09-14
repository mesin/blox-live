import { call, put, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';

import {LOAD_EVENT_LOGS, LOAD_ORGANIZATION, UPDATE_ORGANIZATION} from './actionTypes';
import * as actions from './actions';
import OrganizationService from '../../backend/services/organization/organization.service';
import { normalizedActiveValidators } from './service';

import { setModalDisplay } from '../Dashboard/actions';
import { MODAL_TYPES } from '../Dashboard/constants';

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
    const response = yield call([organizationService, 'get']);
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
    const response = yield call([organizationService, 'update'], { name: action.payload });
    yield call(onUpdatingSuccess, response);
  } catch (error) {
    yield error && call(onUpdatingFailure, error);
  }
}

export function* startLoadingEventLogs() {
  try {
    const response = yield call([organizationService, 'getEventLogs']);
    yield call(onLoadingEventLogsSuccess, response);
  } catch (error) {
    yield error && call(onLoadingEventLogsFailure, error);
  }
}

function* onLoadingEventLogsSuccess(response: Record<string, any>) {
  const activeValidators = normalizedActiveValidators(response);
  if (activeValidators.length > 0) {
    yield put(actions.showActiveValidatorsPopup(activeValidators));
    yield put(setModalDisplay({show: true, type: MODAL_TYPES.ACTIVE_VALIDATOR, text: ''}));
  }
  yield put(actions.loadEventLogsSuccess(response));
}

function* onLoadingEventLogsFailure(error: Record<string, any>) {
  notification.error({ message: 'Error', description: error.message });
  yield put(actions.loadEventLogsFailure(error.response.data));
}

export default function* organizationActions() {
  yield takeLatest(LOAD_ORGANIZATION, startLoadingOrganization);
  yield takeLatest(UPDATE_ORGANIZATION, startUpdatingOrganization);
  yield takeLatest(LOAD_EVENT_LOGS, startLoadingEventLogs);
}
