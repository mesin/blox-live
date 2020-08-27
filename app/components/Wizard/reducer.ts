import produce from 'immer';
import * as actionTypes from './actionTypes';
import { WizardState } from './types';

const initialState: WizardState = {
  isLoading: false,
  error: null,
  wallet: null,
  network: '',
  account: null,
  depositData: null,
};

/* eslint-disable default-case, no-param-reassign */
const wizardReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.LOAD_WALLET:
      draft.isLoading = true;
      break;
    case actionTypes.LOAD_WALLET_SUCCESS:
      draft.isLoading = false;
      draft.wallet = action.payload;
      break;
    case actionTypes.LOAD_WALLET_FAILURE:
      draft.isLoading = false;
      draft.error = action.payload.message;
      break;

    case actionTypes.SET_NETWORK_TYPE:
      draft.network = action.payload;
      break;

    case actionTypes.GENERATE_VALIDATOR_KEY:
      draft.isLoading = true;
      break;
    case actionTypes.GENERATE_VALIDATOR_KEY_SUCCESS:
      draft.isLoading = false;
      draft.account = action.payload;
      break;
    case actionTypes.GENERATE_VALIDATOR_KEY_FAILURE:
      draft.isLoading = false;
      draft.error = action.payload;
      break;

    case actionTypes.LOAD_DEPOSIT_DATA:
      draft.isLoading = true;
      break;
    case actionTypes.LOAD_DEPOSIT_DATA_SUCCESS:
      draft.isLoading = false;
      draft.depositData = action.payload;
      break;
    case actionTypes.LOAD_DEPOSIT_DATA_FAILURE:
      draft.isLoading = false;
      draft.error = action.payload;
      break;

    case actionTypes.SET_FINISHED_WIZARD:
      draft.isFinished = action.payload;
      break;

    case actionTypes.CLEAR_DATA:
      draft.isLoading = initialState.isLoading;
      draft.error = initialState.error;
      draft.wallet = initialState.wallet;
      draft.network = initialState.network;
      draft.account = initialState.account;
      draft.depositData = initialState.depositData;
      break;
  }
});

type Action = {
  type: string;
  payload: any;
};

export default wizardReducer;
