import produce from 'immer';
import * as actionTypes from './actionTypes';
import { LOGOUT } from '../CallbackPage/actionTypes';

const initialState = {
  isValid: false,
  isLoading: false,
};

/* eslint-disable default-case, no-param-reassign */
const passwordHandlerReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.CHECK_PASSWORD_VALIDATION:
      draft.isLoading = true;
      break;
    case actionTypes.SET_PASSWORD_VALIDATION:
      draft.isValid = action.payload;
      draft.isLoading = initialState.isLoading;
      break;
    case actionTypes.CLEAR_PASSWORD_DATA:
    case LOGOUT:
      draft.isValid = initialState.isValid;
      draft.isLoading = initialState.isLoading;
      break;
  }
});

type Action = {
  type: string;
  payload: any;
};

export default passwordHandlerReducer;
