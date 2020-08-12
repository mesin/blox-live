import { eventChannel, END } from 'redux-saga';
import { call, put, take, takeLatest } from 'redux-saga/effects';
import { PROCESS_SUBSCRIBE } from './actionTypes';
import * as actions from './actions';
import { processInstantiator, Listener } from './service';

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
      yield put(actions.processObserve(message, result.payload.isActive, result.payload.data));
    }
  }
  catch (e) {
    yield put(actions.processFailure(e));
  }
  finally {
    yield put(actions.processUnSubscribe());
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

export default function* processRunnerSaga() {
  yield takeLatest(PROCESS_SUBSCRIBE, startProcess);
}
