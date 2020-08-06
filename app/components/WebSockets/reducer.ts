import produce from 'immer';
import * as actionTypes from './actionTypes';
import { WebSocketState } from './types';

const initialState: WebSocketState = {
  instance: null,
  idToken: '',
  isConnected: false,
  isLoading: false,
  error: null,
  data: null,
};

/* eslint-disable default-case, no-param-reassign */
const websocketReducer = (state = initialState, action: Action) => produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.CONNECT_WEB_SOCKET:
        draft.idToken = action.payload;
        draft.isLoading = true;
        break;
      case actionTypes.CONNECT_WEB_SOCKET_SUCCESS:
        draft.instance = action.payload;
        draft.isLoading = false;
        draft.isConnected = true;
        break;
      case actionTypes.CONNECT_WEB_SOCKET_FAILURE:
        draft.error = action.payload.message;
        draft.isLoading = false;
        break;
      case actionTypes.SUBSCRIBE_TO_EVENT:
        draft.isLoading = true;
        break;
      case actionTypes.UNSUBSCRIBE_TO_EVENT:
        draft.isLoading = false;
        break;
      case actionTypes.DATA_RECEIVED:
        draft.data = action.payload;
        break;
    }
  });

type Action = {
  type: string;
  payload: any;
};

export default websocketReducer;
