import { call, put, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';
import * as actionTypes from './actionTypes';
import * as actions from './actions';
import SeedService from 'backend/services/key-vault/seed.service';
import VersionService from 'backend/services/version/version.service';
import Store from 'backend/common/store-manager/store';

const seedService = new SeedService();
const versionService = new VersionService();
const store: Store = Store.getStore();

function* savePassword(action) {
  const { payload } = action;
  yield call([store, 'setCryptoKey'], payload);
}

function* replacePassword(action) {
  const { payload } = action;
  yield call([store, 'setNewPassword'], payload);
}

function* validatePassword(action) {
  const { payload } = action;
  const isValid = yield call([store, 'isCryptoKeyValid'], payload);
  if (isValid) {
    yield call([store, 'setCryptoKey'], payload);
  }
  yield put(actions.keyvaultSetPasswordValidation(isValid));
}

function* startLoadingMnemonic() {
  try {
    const mnemonicPhrase = yield call([seedService, 'mnemonicGenerate']);
    yield put(actions.keyvaultLoadMnemonicSuccess(mnemonicPhrase));
  } catch (error) {
    yield put(actions.keyvaultLoadMnemonicFailure(error));
    notification.error({ message: 'Error', description: error.message });
  }
}

function* startSavingMnemonic(action) {
  const { payload } = action;
  const { mnemonic, password } = payload;
  try {
    yield call([seedService, 'storeMnemonic'], mnemonic);
    yield put(actions.keyvaultSaveMnemonicSuccess());
    yield put(actions.keyvaultReplacePassword(password));
  } catch (error) {
    yield put(actions.keyvaultSaveMnemonicFailure(error));
    notification.error({ message: 'Error', description: error.message });
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
  yield takeLatest(actionTypes.KEYVAULT_SAVE_PASSWORD, savePassword);
  yield takeLatest(actionTypes.KEYVAULT_REPLACE_PASSWORD, replacePassword);
  yield takeLatest(actionTypes.KEYVAULT_CHECK_PASSWORD_VALIDATION, validatePassword);
}
