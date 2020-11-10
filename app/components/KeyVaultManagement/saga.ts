import { call, put, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';
import * as actionTypes from './actionTypes';
import * as actions from './actions';

import VersionService from 'backend/services/version/version.service';
import Store from 'backend/common/store-manager/store';
import KeyManagerService from '../../backend/services/key-manager/key-manager.service';

const keyManagerService = new KeyManagerService();
const versionService = new VersionService();

function* startLoadingMnemonic() {
  try {
    const mnemonicPhrase = yield call([keyManagerService, 'mnemonicGenerate']);
    yield put(actions.keyvaultLoadMnemonicSuccess(mnemonicPhrase));
  } catch (error) {
    yield put(actions.keyvaultLoadMnemonicFailure(error));
    notification.error({ message: 'Error', description: error.message });
  }
}

function* startSavingMnemonic(action) {
  try {
    const { payload: { mnemonic } } = action;
    const store: Store = Store.getStore();
    const seed = yield call([keyManagerService, 'seedFromMnemonicGenerate'], mnemonic);
    yield store.set('seed', seed);
    yield put(actions.keyvaultSaveMnemonicSuccess());
  }
  catch (error) {
    if (error) {
      yield put(actions.keyvaultSaveMnemonicFailure(error));
      notification.error({ message: 'Error', description: error.message });
    }
  }
}

function* startLoadingLatestVersion() {
  try {
    const latestVersion = yield call([versionService, 'getLatestKeyVaultVersion']);
    yield put(actions.keyvaultLoadLatestVersionSuccess(latestVersion));
  } catch (error) {
    yield put(actions.keyvaultLoadLatestVersionFailure(error));
    notification.error({ message: 'Error', description: error.message });
  }
}

export default function* keyVaultManagementSaga() {
  yield takeLatest(actionTypes.KEYVAULT_LOAD_MNEMONIC, startLoadingMnemonic);
  yield takeLatest(actionTypes.KEYVAULT_SAVE_MNEMONIC, startSavingMnemonic);
  yield takeLatest(actionTypes.KEYVAULT_LOAD_LATEST_VERSION, startLoadingLatestVersion);
}
