import produce from 'immer';
import * as actionTypes from './actionTypes';

const initialState = {
  isLoading: false,
  error: null,
  data: null,
};

/* eslint-disable default-case, no-param-reassign */
const accountsReducer = (state = initialState, action: Action) => produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.LOAD_ACCOUNTS:
        draft.isLoading = true;
        break;
      case actionTypes.LOAD_ACCOUNTS_SUCCESS:
        draft.data = action.payload;
        draft.isLoading = false;
        break;
      case actionTypes.LOAD_ACCOUNTS_FAILURE:
        draft.error = action.payload;
        draft.isLoading = false;
        break;

      case actionTypes.DELETE_ACCOUNT:
        draft.isLoading = true;
        break;
      case actionTypes.DELETE_ACCOUNT_SUCCESS:
        draft.isLoading = false;
        break;
      case actionTypes.DELETE_ACCOUNT_FAILURE:
        draft.isLoading = false;
        break;

      case actionTypes.CLEAR_DATA:
        draft.isLoading = initialState.isLoading;
        draft.error = initialState.error;
        draft.data = initialState.data;
        break;
    }
  });

type Action = {
  type: string;
  payload: any;
};

export default accountsReducer;
