import { eventChannel, END } from 'redux-saga';
import { call, put, take, takeLatest } from 'redux-saga/effects'; // select
import Configstore from 'configstore';
import InstallProcess from '../../backend/proccess-manager/install.process';
import { Observer } from '../../backend/proccess-manager/observer.interface';
import { Subject } from '../../backend/proccess-manager/subject.interface';
// import { notification } from 'antd';

import { KEYVAULT_RESTART } from './actionTypes';
import * as actions from './actions';
// import { getIdToken } from '../CallbackPage/selectors';


class Listener implements Observer { // TODO: check where to implement it
  private logFunc: any;
  constructor(func: any) {
    this.logFunc = func;
  }

  public update(subject: Subject, payload: any) {
    debugger;
    this.logFunc(`${subject.state}/${subject.actions.length} > ${payload.msg}`);
    console.log(`${subject.state}/${subject.actions.length}`, payload.msg);
  }
}

// function* onSuccess() {
//   yield put(actions.keyvaultRestartSuccess());
// }

// function* onFailure(error) {
//   yield put(actions.keyvaultRestartFailure(error));
//   notification.error({ message: 'Error', description: error.message });
// }

export function* startRestarting() {
  // const idToken = yield select(getIdToken);
  debugger;
  const setProcessStatus = '';
  const storeName = 'blox';
  const conf = new Configstore(storeName);
  conf.set('otp', 'otp something');
  conf.set('credentials', {
    accessKeyId: 'AKIARYXLX53R4KHH3PTF',
    secretAccessKey: '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',
  });

  debugger;

  const installProcess = yield new InstallProcess(storeName);
  const listener = new Listener(setProcessStatus);
  installProcess.subscribe(listener);
  const channel = yield call(createChannel, installProcess, listener);
  try {
    while (true) {
      const results = yield take(channel);
      console.log('results', results);
      debugger;
      // yield put(actions.dataReceived(results));
    }
  }
  finally {
    yield put(actions.keyvaultRestartUnSubscribe());
    channel.close();
  }
}

function createChannel(process, listener) {
  return eventChannel((emitter) => {
    const subscribe = (eventPayload) => {
      debugger;
      if (false) {
        process.off();
        emitter(eventPayload);
        emitter(END);
      }
      emitter(eventPayload);
    };

    if (process) {
      process.subscribe(listener);
      // process.on(listener, (data) => subscribe(data));
    }

    const unsubscribeTo = () => {
      process.unsubscribe(listener);
    };

    return unsubscribeTo;
  });
}

export default function* keyVaultManagementSaga() {
  yield takeLatest(KEYVAULT_RESTART, startRestarting);
}
