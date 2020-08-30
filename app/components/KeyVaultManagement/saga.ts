import { call, put, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';
import { KEYVAULT_LOAD_LATEST_VERSION, KEYVAULT_LOAD_MNEMONIC, KEYVAULT_SAVE_MNEMONIC } from './actionTypes';
import * as actions from './actions';
import SeedService from 'backend/key-vault/seed.service';
import BloxApiService from 'backend/communication-manager/blox-api.service';
import { METHOD } from 'backend/communication-manager/constants';

const seedService = new SeedService();

function* startLoadingMnemonic() {
  try {
    const mnemonicPhrase = yield call(seedService.mnemonicGenerate);
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
    yield call(seedService.storeMnemonic, mnemonic, password);
    yield put(actions.keyvaultSaveMnemonicSuccess());
  } catch (error) {
    yield put(actions.keyvaultSaveMnemonicFailure(error));
    notification.error({ message: 'Error', description: error.message });
  }
}

function* startLoadingLatestVersion() {
  try {
    const latestVersion = yield call(BloxApiService.request, METHOD.GET, 'key-vault/latest-tag');
    yield put(actions.KevaultLoadLatestVersionSuccess(latestVersion));
  } catch (error) {
    yield put(actions.KevaultLoadLatestVersionFailure(error));
    notification.error({ message: 'Error', description: error.message });
  }
}

export default function* keyVaultManagementSaga() {
  yield takeLatest(KEYVAULT_LOAD_MNEMONIC, startLoadingMnemonic);
  yield takeLatest(KEYVAULT_SAVE_MNEMONIC, startSavingMnemonic);
  yield takeLatest(KEYVAULT_LOAD_LATEST_VERSION, startLoadingLatestVersion);
}
