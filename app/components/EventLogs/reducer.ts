import produce from 'immer';
import * as actionTypes from './actionTypes';
import { LOGOUT } from '../CallbackPage/actionTypes';

export const initialState: State = {
  data: null,
  isLoading: false,
  error: null,
  activeValidators: [],
};

/* eslint-disable default-case, no-param-reassign */
const eventLogsReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.LOAD_EVENT_LOGS:
      draft.isLoading = true;
      break;
    case actionTypes.LOAD_EVENT_LOGS_SUCCESS:
      draft.data = action.payload;
      draft.isLoading = false;
      break;
    case actionTypes.LOAD_EVENT_LOGS_FAILURE:
      draft.error = action.payload;
      draft.isLoading = false;
      break;
    case actionTypes.SHOW_ACTIVE_VALIDATORS_POP_UP:
      draft.activeValidators = action.payload;
      break;
    case LOGOUT:
      draft.data = initialState.data;
      draft.isLoading = initialState.isLoading;
      draft.error = initialState.error;
      break;
  }
});

type State = {
  data: any;
  isLoading: boolean;
  error: string;
  activeValidators: [],
};

type Action = {
  type: string;
  payload: any;
};

export default eventLogsReducer;
