import produce from 'immer';
import * as actionTypes from './actionTypes';
import {State, Action} from './types';
import {LOGOUT} from '../CallbackPage/actionTypes';

export const initialState: State = {
  isLoading: false,
  isUpdateLoading: false,
  data: {
    name: '',
    id: 0,
    creatorId: 0,
    createdAt: '',
  },
  error: '',
  isLoadingEventLogs: false,
  eventLogsError: null,
  eventLogs: null,
  activeValidators: [],
};

/* eslint-disable default-case, no-param-reassign */
const organizationReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.SET_ORGANIZATION_NAME:
      draft.data.name = action.payload;
      break;
    case actionTypes.LOAD_ORGANIZATION:
      draft.isLoading = true;
      break;
    case actionTypes.LOAD_ORGANIZATION_SUCCESS:
      draft.data = action.payload;
      draft.isLoading = false;
      break;
    case actionTypes.LOAD_ORGANIZATION_FAILURE:
      draft.isLoading = false;
      break;
    case actionTypes.UPDATE_ORGANIZATION:
      draft.isUpdateLoading = true;
      break;
    case actionTypes.UPDATE_ORGANIZATION_SUCCESS:
      draft.isUpdateLoading = false;
      draft.data = action.payload;
      break;
    case actionTypes.UPDATE_ORGANIZATION_FAILURE:
      draft.isUpdateLoading = false;
      draft.error = action.payload;
      break;
    case actionTypes.LOAD_EVENT_LOGS:
      draft.isLoadingEventLogs = true;
      break;
    case actionTypes.LOAD_EVENT_LOGS_SUCCESS:
      draft.eventLogs = action.payload;
      draft.isLoadingEventLogs = false;
      break;
    case actionTypes.LOAD_EVENT_LOGS_FAILURE:
      draft.eventLogsError = action.payload;
      draft.isLoadingEventLogs = false;
      break;
    case actionTypes.SHOW_ACTIVE_VALIDATORS_POP_UP:
      draft.activeValidators = action.payload;
      break;
    case LOGOUT:
      draft.isLoadingEventLogs = initialState.isLoadingEventLogs;
      draft.eventLogs = initialState.eventLogs;
      draft.eventLogsError = initialState.eventLogsError;
      break;
  }
});

export default organizationReducer;
