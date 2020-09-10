import {call, put, takeLatest} from 'redux-saga/effects';
import {notification} from 'antd';
import {LOAD_BLOX_LIVE_VERSION} from './actionTypes';
import * as actions from './actions';
import VersionsService from '../../backend/services/versions/version.service';

const versionsService = new VersionsService();

export function* startLoadingBloxLiveLatestVersion() {
  try {
    const latestVersion = yield call([versionsService, 'getBloxLiveVersion']);
    yield call(onLoadingBloxLiveLatestSuccess, latestVersion);
  } catch (error) {
    yield error && call(onLoadingBloxLiveVersionFailure, error);
  }
}

function* onLoadingBloxLiveLatestSuccess(latestVersion: string) {
  yield put(actions.loadBloxLiveVersionSuccess(latestVersion));
}

function* onLoadingBloxLiveVersionFailure(error: Record<string, any>) {
  notification.error({message: 'Error', description: error.message});
  yield put(actions.loadBloxLiveVersionFailure(error.response.data));
}

export default function* versionsActions() {
  yield takeLatest(LOAD_BLOX_LIVE_VERSION, startLoadingBloxLiveLatestVersion);
}
