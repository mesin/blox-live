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
      const observePayload = {
        overallSteps: result.subject.actions.length,
        currentStep: result.subject.state,
        message: result.payload.step.name,
        isActive: result.payload.isActive,
        data: result.payload.data
      };
      yield put(actions.processObserve(observePayload));
    }
  } catch (e) {
    yield put(actions.processFailure(e));
    channel.close();
  } finally {
    yield put(actions.processUnSubscribe());
    channel.close();
  }
}

function createChannel(process) {
  return eventChannel((emitter) => {
    const callback = (subject, payload) => {
      const { state } = subject;
      const { status } = payload.step;
      if (status === 'error') {
        process.unsubscribe(listener);
        emitter(payload.error);
      }
      if (status === 'completed' && state === subject.actions.length) {
        process.unsubscribe(listener);
        emitter({ subject, payload });
        emitter(END);
        return;
      }
      emitter({ subject, payload });
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
