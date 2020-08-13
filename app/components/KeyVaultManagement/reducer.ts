import produce from 'immer';
import * as actionTypes from './actionTypes';

const initialState = {
  isLoading: false,
  error: '',
  cloudProvider: '',
  mnemonic: '',
};

/* eslint-disable default-case, no-param-reassign */
const KeyVaultManagementReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.KEYVAULT_SET_COLUD_PROVIDER:
      draft.cloudProvider = action.payload;
      break;
    case actionTypes.KEYVAULT_LOAD_MNEMONIC:
    case actionTypes.KEYVAULT_SAVE_MNEMONIC:
      draft.isLoading = true;
      break;
    case actionTypes.KEYVAULT_LOAD_MNEMONIC_SUCCESS:
      draft.mnemonic = action.payload;
      draft.isLoading = initialState.isLoading;
      break;
    case actionTypes.KEYVAULT_SAVE_MNEMONIC_SUCCESS:
      draft.isLoading = initialState.isLoading;
      break;
    case actionTypes.KEYVAULT_LOAD_MNEMONIC_FAILURE:
    case actionTypes.KEYVAULT_SAVE_MNEMONIC_FAILURE:
      draft.error = action.payload.message;
      draft.isLoading = initialState.isLoading;
      break;
  }
});

type Action = {
  type: string;
  payload: any;
};

export default KeyVaultManagementReducer;
