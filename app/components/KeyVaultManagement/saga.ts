import { eventChannel, END } from 'redux-saga';
import { call, put, take, takeLatest } from 'redux-saga/effects';
import { KEYVAULT_PROCESS_SUBSCRIBE, KEYVAULT_SET_CREDENTIALS } from './actionTypes';
import * as actions from './actions';
import { processInstantiator, saveCredentialsInConfigStore, isReadyToRunProcess } from './service';

import { Observer } from '../../backend/proccess-manager/observer.interface';
import { Subject } from '../../backend/proccess-manager/subject.interface';

// function* onSuccess() {
//   yield put(actions.keyvaultRestartSuccess());
// }

// function* onFailure(error) {
//   yield put(actions.keyvaultRestartFailure(error));
//   notification.error({ message: 'Error', description: error.message });
// }

class Listener implements Observer {
  private logFunc: any;
  constructor(func: any) {
    this.logFunc = func;
  }
  public update(subject: Subject, payload: any) {
    this.logFunc(subject, payload);
  }
}

const storeName = 'blox';

function* startSettingCredentials(action) {
  const { payload } = action;
  yield call(saveCredentialsInConfigStore, storeName, payload);
}

function* startProcess(action) {
  const { payload } = action;

  if (!isReadyToRunProcess(storeName)) {
    yield put(actions.keyvaultProcessFailure(new Error('missing credentials')));
    return;
  }

  const process = processInstantiator(payload.name, storeName);
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

export default function* keyVaultManagementSaga() {
  yield takeLatest(KEYVAULT_PROCESS_SUBSCRIBE, startProcess);
  yield takeLatest(KEYVAULT_SET_CREDENTIALS, startSettingCredentials);
}
