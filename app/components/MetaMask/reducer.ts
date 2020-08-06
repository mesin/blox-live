import produce from 'immer';
import * as actionTypes from './actionTypes';
import { State } from './types';

const initialState: State = {
  isLoading: false,
  error: null,
  isExist: false,
  isExistChecked: false,
  accounts: [],
  txHash: '',
};

/* eslint-disable default-case, no-param-reassign */
const metaMaskReducer = (state = initialState, action: Action) => produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.CHECK_IF_METAMASK_EXIST:
        draft.isExistChecked = true;
        draft.isExist = action.payload;
        break;
      case actionTypes.LOAD_METAMASK_ACCOUNTS:
        draft.isLoading = true;
        break;
      case actionTypes.LOAD_METAMASK_ACCOUNTS_SUCCESS:
        draft.isLoading = false;
        draft.accounts = action.payload;
        break;
      case actionTypes.LOAD_METAMASK_ACCOUNTS_FAILURE:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      case actionTypes.SEND_ETH_FROM_METAMASK:
        draft.isLoading = true;
        break;
      case actionTypes.SEND_ETH_FROM_METAMASK_SUCCESS:
        draft.isLoading = false;
        draft.txHash = action.payload;
        break;
      case actionTypes.SEND_ETH_FROM_METAMASK_FAILURE:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
    }
  });

type Action = {
  type: string;
  payload: any;
};

export default metaMaskReducer;
