import {call, put, takeLatest} from 'redux-saga/effects';
import {notification} from 'antd';
import {LOAD_BLOX_LIVE_VERSION} from './actionTypes';
import * as actions from './actions';
import VersionService from '../../backend/services/version/version.service';

export function* startLoadingBloxLiveLatestVersion() {
  try {
    const versionService = new VersionService();
    const latestVersion = yield call([versionService, 'getLatestBloxLiveVersion']);
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
