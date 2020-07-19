import * as actionTypes from './actionTypes';

export const connectToWebSockets = () => ({
  type: actionTypes.CONNECT_WEB_SOCKET,
});

export const connectToWebSocketsSuccess = () => ({
  type: actionTypes.CONNECT_WEB_SOCKET_SUCCESS,
});

export const connectToWebSocketsFailure = (error: Record<string, any>) => ({
  type: actionTypes.CONNECT_WEB_SOCKET_FAILURE,
  payload: error,
});

export const disconnectFromWebSockets = () => ({
  type: actionTypes.DISCONNECT_WEB_SOCKET,
});

export const subscribeToEvent = (
  eventName: string,
  doneCondition: Record<string, any>
) => ({
  type: actionTypes.SUBSCRIBE_TO_EVENT,
  payload: { eventName, doneCondition },
});

export const unsubscribeToEvent = (payload: string) => ({
  type: actionTypes.UNSUBSCRIBE_TO_EVENT,
  payload,
});

export const dataReceived = (data: Record<string, any>) => ({
  type: actionTypes.DATA_RECEIVED,
  payload: { ...data },
});
