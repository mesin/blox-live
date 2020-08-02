import { eventChannel, END } from 'redux-saga';
import { call, put, take, takeLatest } from 'redux-saga/effects';
import { KEYVAULT_PROCESS_SUBSCRIBE } from './actionTypes';
import * as actions from './actions';
import { processInstantiator } from './service';

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

export function* startProcess(action) {
  const { payload } = action;
  const storeName = 'blox';
  const process = processInstantiator(payload.name, storeName);
  const channel = yield call(createChannel, process);
  try {
    while (true) {
      const results = yield take(channel);
      console.log('results', results);
      yield put(actions.keyvaultProcessObserve(results));
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
      const { msg, status } = payload;
      console.log('subject', subject);
      console.log('payload', payload);
      if (status === 'completed' && state === subject.actions.length) {
        emitter(`${state}/${subject.actions.length} > ${msg}`);
        process.unsubscribe(listener);
        emitter(END);
      }
      emitter(`${state}/${subject.actions.length} > ${msg}`);
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
}
