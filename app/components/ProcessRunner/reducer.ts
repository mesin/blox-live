import produce from 'immer';
import * as actionTypes from './actionTypes';

const initialState = {
  name: '',
  message: '',
  isServerActive: false,
  data: null,
  isLoading: false,
  isDone: false,
  error: '',
};

/* eslint-disable default-case, no-param-reassign */
const processRunnerReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.PROCESS_SUBSCRIBE:
      draft.isLoading = true;
      draft.name = action.payload.name;
      draft.message = action.payload.defaultMessage;
      break;
    case actionTypes.PROCESS_OBSERVE:
      draft.message = action.payload.message;
      draft.isServerActive = action.payload.isActive;
      draft.data = action.payload.data;
      break;
    case actionTypes.PROCESS_UNSUBSCRIBE:
      draft.isLoading = initialState.isLoading;
      draft.name = initialState.name;
      draft.message = initialState.message;
      draft.isDone = true;
      break;
    case actionTypes.PROCESS_FAILURE:
      draft.error = action.payload.message;
      draft.isLoading = initialState.isLoading;
      draft.name = initialState.name;
      draft.message = initialState.message;
      draft.isDone = true;
      break;
    case actionTypes.PROCESS_CLEAR_STATE:
      draft.isDone = initialState.isDone;
      break;
  }
});

type Action = {
  type: string;
  payload: any;
};

export default processRunnerReducer;
