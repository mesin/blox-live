import { eventChannel, END } from 'redux-saga';
import { call, put, take, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';
import { KEYVAULT_PROCESS_SUBSCRIBE, KEYVAULT_LOAD_MNEMONIC, KEYVAULT_SAVE_MNEMONIC } from './actionTypes';
import * as actions from './actions';
import { processInstantiator } from './service';

import { Observer } from '../../backend/proccess-manager/observer.interface';
import { Subject } from '../../backend/proccess-manager/subject.interface';
import SeedService from '../../backend/key-vault/seed.service';

const seedService = new SeedService('blox');

class Listener implements Observer {
  private logFunc: any;
  constructor(func: any) {
    this.logFunc = func;
  }
  public update(subject: Subject, payload: any) {
    this.logFunc(subject, payload);
  }
}

function* startProcess(action) {
  const { payload } = action;
  const { name, credentials } = payload;

  const process = processInstantiator(name, credentials);
  const channel = yield call(createChannel, process);
  try {
    while (true) {
      const result = yield take(channel);
      console.log('result', result);
      console.log('state', result.subject.state);
      console.log('allStates', result.subject.actions.length);
      console.log('stepName', result.payload.step.name);
      console.log('isActive', result.payload.isActive);

      const message = `${result.subject.state}/${result.subject.actions.length} > ${result.payload.step.name}`;
      yield put(actions.keyvaultProcessObserve(message, result.payload.isActive));
    }
  }
  catch (e) {
    yield put(actions.keyvaultProcessFailure(e));
  }
  finally {
    yield put(actions.keyvaultProcessUnSubscribe());
    channel.close();
  }
}

function createChannel(process) {
  return eventChannel((emitter) => {
    const callback = (subject, payload) => {
      const { state } = subject;
      const { status } = payload.step;
      if (status === 'completed' && state === subject.actions.length) {
        process.unsubscribe(listener);
        emitter({subject, payload});
        emitter(END);
        return;
      }
      emitter({subject, payload});
    };

    const listener = new Listener(callback);
    process.run();
    process.subscribe(listener);

    const unsubscribeTo = () => {
      process.unsubscribe(listener);
    };

    return unsubscribeTo;
  });
}

function* startLoadingMnemonic() {
  try {
    const mnemonicPhrase = yield call(seedService.mnemonicGenerate);
    yield put(actions.keyvaultLoadMnemonicSuccess(mnemonicPhrase));
  }
  catch (error) {
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
  }
  catch (error) {
    yield put(actions.keyvaultSaveMnemonicFailure(error));
    notification.error({ message: 'Error', description: error.message });
  }
}

export default function* keyVaultManagementSaga() {
  yield takeLatest(KEYVAULT_PROCESS_SUBSCRIBE, startProcess);
  yield takeLatest(KEYVAULT_LOAD_MNEMONIC, startLoadingMnemonic);
  yield takeLatest(KEYVAULT_SAVE_MNEMONIC, startSavingMnemonic);
}
