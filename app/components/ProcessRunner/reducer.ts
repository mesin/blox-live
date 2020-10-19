import produce from 'immer';
import * as actionTypes from './actionTypes';
import { LOGOUT } from '../CallbackPage/actionTypes';

const initialState = {
  name: '',
  message: '',
  overallSteps: 0,
  currentStep: 0,
  isServerActive: false,
  data: null,
  isLoading: false,
  isDone: false,
  error: '',
};

/* eslint-disable default-case, no-param-reassign */
const processRunnerReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.PROCESS_SUBSCRIBE:
      draft.isLoading = true;
      draft.name = payload.name;
      draft.message = payload.defaultMessage;
      draft.error = '';
      break;
    case actionTypes.PROCESS_OBSERVE:
      draft.message = payload.message;
      draft.isServerActive = payload.isActive;
      draft.data = payload.data;
      draft.overallSteps = payload.overallSteps;
      draft.currentStep = payload.currentStep;
      break;
    case actionTypes.PROCESS_UNSUBSCRIBE:
      draft.isLoading = initialState.isLoading;
      draft.name = initialState.name;
      draft.message = initialState.message;
      draft.isDone = true;
      break;
    case actionTypes.PROCESS_FAILURE:
      draft.error = payload.message;
      draft.isLoading = initialState.isLoading;
      draft.name = initialState.name;
      draft.message = initialState.message;
      draft.isDone = true;
      break;
    case actionTypes.PROCESS_CLEAR_STATE:
    case LOGOUT:
      draft.name = initialState.name;
      draft.message = initialState.message;
      draft.overallSteps = initialState.overallSteps;
      draft.currentStep = initialState.currentStep;
      draft.data = initialState.data;
      draft.isDone = initialState.isDone;
      draft.overallSteps = initialState.overallSteps;
      draft.currentStep = initialState.currentStep;
      draft.isServerActive = initialState.isServerActive;
      draft.error = initialState.error;
      break;
  }
});

type Action = {
  type: string;
  payload: any;
};

export default processRunnerReducer;
