import { eventChannel, END } from 'redux-saga';
import { call, put, select, take, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';
import WebSockets from './WebSockets';

import { CONNECT_WEB_SOCKET, SUBSCRIBE_TO_EVENT } from './actionTypes';
import * as actions from './actions';
import { getIdToken } from '../CallbackPage/selectors';
import { getWebsocket } from './selectors';

function* onSuccess(ws) {
  yield call(ws.init);
  yield put(actions.connectToWebSocketsSuccess(ws));
}

function* onFailure(error) {
  yield put(actions.connectToWebSocketsFailure(error));
  notification.error({ message: 'Error', description: error.message });
}

export function* connectToWebsocket() {
  const idToken = yield select(getIdToken);
  try {
    const ws = new WebSockets(idToken);
    yield call(onSuccess, ws);
  } catch (error) {
    yield error && call(onFailure, error);
  }
}

function createSocketChannel(ws, payload) {
  const { eventName, doneCondition } = payload;
  return eventChannel((emitter) => {
    const subscribe = (eventPayload, done) => {
      if (eventPayload[doneCondition.key] === doneCondition.value) {
        ws.unsubscribeTo(eventName, done);
        emitter(eventPayload);
        emitter(END);
      }
      emitter(eventPayload);
    };

    if (ws && eventName) {
      ws.emit(eventName);
      ws.subscribeTo(eventName, subscribe);
    }

    const unsubscribeTo = () => {
      ws.unsubscribeTo(eventName);
    };

    return unsubscribeTo;
  });
}

function* connectWebSocketChannel(action) {
  const { payload } = action;
  const ws = yield select(getWebsocket);
  const channel = yield call(createSocketChannel, ws, payload);
  try {
    while (true) {
      const results = yield take(channel);
      yield put(actions.dataReceived(results));
    }
  } finally {
    yield put(actions.unsubscribeToEvent(payload));
    channel.close();
  }
}

export default function* websocketSaga() {
  yield takeLatest(CONNECT_WEB_SOCKET, connectToWebsocket);
  yield takeLatest(SUBSCRIBE_TO_EVENT, connectWebSocketChannel);
}
