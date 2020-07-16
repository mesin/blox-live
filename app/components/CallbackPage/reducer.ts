import produce from 'immer';
import {
  LOGIN_INIT,
  LOGIN_SET_ID_TOKEN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from './actionTypes';
import { State } from './types';

export const initialState: State = {
  isLoading: false,
  isLoggedIn: false,
  idToken: '',
  error: null,
  userData: {},
};

/* eslint-disable default-case, no-param-reassign */
const loginReducer = (state = initialState, action: Action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOGIN_INIT:
        draft.isLoading = true;
        break;
      case LOGIN_SET_ID_TOKEN:
        draft.idToken = action.payload;
        break;
      case LOGIN_SUCCESS:
        draft.userData = { ...action.payload };
        draft.isLoading = false;
        draft.isLoggedIn = true;
        break;
      case LOGIN_FAILURE:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
    }
  });

type Action = {
  type: string;
  payload: any;
};

export default loginReducer;
