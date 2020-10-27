import { call, put, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';
import * as actionTypes from './actionTypes';
import * as actions from './actions';

import VersionService from 'backend/services/version/version.service';
import Store from 'backend/common/store-manager/store';
import KeyManagerService from '../../backend/services/key-manager/key-manager.service';

const keyManagerService = new KeyManagerService();
const versionService = new VersionService();
const store: Store = Store.getStore();

function* loadMnemonicSaga() {
  try {
    const mnemonicPhrase = yield call([keyManagerService, 'mnemonicGenerate']);
    yield put(actions.keyvaultLoadMnemonicSuccess(mnemonicPhrase));
  } catch (error) {
    yield put(actions.keyvaultLoadMnemonicFailure(error));
    notification.error({ message: 'Error', description: error.message });
  }
}

function* saveMnemonicSaga(action) {
  try {
    const { payload: { mnemonic } } = action;
    const seed = yield call([keyManagerService, 'seedFromMnemonicGenerate'], mnemonic);
    store.set('seed', seed);
    yield put(actions.keyvaultSaveMnemonicSuccess());
  }
  catch (error) {
    if (error) {
      yield put(actions.keyvaultSaveMnemonicFailure(error));
      notification.error({ message: 'Error', description: error.message });
    }
  }
}

function* loadLatestVersionSaga() {
  try {
    const latestVersion = yield call([versionService, 'getLatestKeyVaultVersion']);
    yield put(actions.keyvaultLoadLatestVersionSuccess(latestVersion));
  } catch (error) {
    yield put(actions.keyvaultLoadLatestVersionFailure(error));
    notification.error({ message: 'Error', description: error.message });
  }
}

function* validatePassphraseSaga() {
  try {
    yield setTimeout(() => null, 1000); // TODO: remove this line and call the relevant service
    yield put(actions.keyvaultValidatePassphraseSuccess());
  }
  catch (error) {
    yield put(actions.keyvaultValidatePassphraseFailure(error));
    notification.error({ message: 'Error', description: error.message });
  }
};

export default function* keyVaultManagementSaga() {
  yield takeLatest(actionTypes.KEYVAULT_LOAD_MNEMONIC, loadMnemonicSaga);
  yield takeLatest(actionTypes.KEYVAULT_SAVE_MNEMONIC, saveMnemonicSaga);
  yield takeLatest(actionTypes.KEYVAULT_LOAD_LATEST_VERSION, loadLatestVersionSaga);
  yield takeLatest(actionTypes.KEYVAULT_VALIDATE_PASSPHRASE, validatePassphraseSaga);
}
