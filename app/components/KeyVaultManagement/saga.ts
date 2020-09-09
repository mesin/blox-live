import { call, put, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';
import { KEYVAULT_LOAD_LATEST_VERSION, KEYVAULT_LOAD_MNEMONIC, KEYVAULT_SAVE_MNEMONIC,
         KEYVAULT_SAVE_PASSWORD, KEYVAULT_REPLACE_PASSWORD, KEYVAULT_VALIDATE_PASSWORD } from './actionTypes';
import * as actions from './actions';
import SeedService from 'backend/services/key-vault/seed.service';
import WalletService from 'backend/services/wallet/wallet.service';
import Store from 'backend/common/store-manager/store';

const seedService = new SeedService();
const walletService = new WalletService();
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
  console.log('isValid', isValid);
  debugger;
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
    const latestVersion = yield call([walletService, 'getLatestTag']);
    yield put(actions.keyvaultLoadLatestVersionSuccess(latestVersion));
  } catch (error) {
    yield put(actions.keyvaultLoadLatestVersionFailure(error));
    notification.error({ message: 'Error', description: error.message });
  }
}

export default function* keyVaultManagementSaga() {
  yield takeLatest(KEYVAULT_LOAD_MNEMONIC, startLoadingMnemonic);
  yield takeLatest(KEYVAULT_SAVE_MNEMONIC, startSavingMnemonic);
  yield takeLatest(KEYVAULT_LOAD_LATEST_VERSION, startLoadingLatestVersion);
  yield takeLatest(KEYVAULT_SAVE_PASSWORD, savePassword);
  yield takeLatest(KEYVAULT_REPLACE_PASSWORD, replacePassword);
  yield takeLatest(KEYVAULT_VALIDATE_PASSWORD, validatePassword);
}
