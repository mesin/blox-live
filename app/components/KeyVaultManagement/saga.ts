import { eventChannel } from 'redux-saga';
import { call, put, take, takeLatest } from 'redux-saga/effects';
import RebootProcess from '../../backend/proccess-manager/reboot.process';
import { KEYVAULT_RESTART } from './actionTypes';
import * as actions from './actions';

// function* onSuccess() {
//   yield put(actions.keyvaultRestartSuccess());
// }

// function* onFailure(error) {
//   yield put(actions.keyvaultRestartFailure(error));
//   notification.error({ message: 'Error', description: error.message });
// }

export function* startRestarting() {
  const storeName = 'blox';
  const rebootProcess = new RebootProcess(storeName);
  yield rebootProcess.run();
  const channel = yield call(createChannel, rebootProcess);
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

function createChannel(process) {
  return eventChannel((emitter) => {
    const observer = (message) => {
      console.log('message', message);
      debugger;
      emitter(message);
    };

    if (process) {
      debugger;
      console.log('process', process);
      process.subscribe(observer);
   }

    const unsubscribeTo = () => {
      process.unsubscribe(observer);
    };

    return unsubscribeTo;
  });
}

export default function* keyVaultManagementSaga() {
  yield takeLatest(KEYVAULT_RESTART, startRestarting);
}
