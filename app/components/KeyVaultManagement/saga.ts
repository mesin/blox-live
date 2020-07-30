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
  const channel = yield call(createChannel, payload);
  try {
    while (true) {
      const results = yield take(channel);
      console.log('results', results);
      yield put(actions.keyvaultProcessObserve(results));
    }
  } // TODO: check out catch here
  finally {
    yield put(actions.keyvaultProcessUnSubscribe());
    channel.close();
  }
}

function createChannel(processName) {
  return eventChannel((emitter) => {
    const storeName = 'blox';
    const process = processInstantiator(processName, storeName);

    // const rebootProcess = new RebootProcess(storeName);

    const callback = (subject, payload) => {
      if (payload.status === 'completed') {
        process.unsubscribe(listener);
        emitter(`${subject.state}/${subject.actions.length} > ${payload.msg}`);
        emitter(END);
      }
      emitter(`${subject.state}/${subject.actions.length} > ${payload.msg}`);
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
