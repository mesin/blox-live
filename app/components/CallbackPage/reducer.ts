import produce from 'immer';
import * as actionTypes from './actionTypes';
import { State } from './types';

export const initialState: State = {
  isLoading: false,
  isLoggedIn: false,
  idToken: '',
  error: null,
  userData: {},
};

/* eslint-disable default-case, no-param-reassign */
const loginReducer = (state = initialState, action: Action) => produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.LOGIN_INIT:
        draft.isLoading = true;
        break;
      case actionTypes.LOGIN_SET_ID_TOKEN:
        draft.idToken = action.payload;
        break;
      case actionTypes.LOGIN_SUCCESS:
        draft.userData = { ...action.payload };
        draft.isLoading = false;
        draft.isLoggedIn = true;
        break;
      case actionTypes.LOGIN_FAILURE:
        draft.isLoading = false;
        break;
      case actionTypes.LOGOUT:
        draft.idToken = initialState.idToken;
        draft.isLoggedIn = initialState.isLoggedIn;
        draft.isLoading = initialState.isLoading;
        draft.userData = initialState.userData;
        break;
    }
  });

type Action = {
  type: string;
  payload: any;
};

export default loginReducer;
