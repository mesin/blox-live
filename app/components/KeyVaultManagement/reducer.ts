import produce from 'immer';
import * as actionTypes from './actionTypes';
import { LOGOUT } from '../CallbackPage/actionTypes';

const initialState = {
  isLoading: false,
  error: '',
  cloudProvider: '',
  mnemonic: '',
  latestVersion: '',
};

/* eslint-disable default-case, no-param-reassign */
const KeyVaultManagementReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.KEYVAULT_SET_COLUD_PROVIDER:
      draft.cloudProvider = action.payload;
      break;
    case actionTypes.KEYVAULT_LOAD_MNEMONIC:
    case actionTypes.KEYVAULT_SAVE_MNEMONIC:
    case actionTypes.KEYVAULT_LOAD_LATEST_VERSION:
    case actionTypes.KEYVAULT_VALIDATE_PASSPHRASE:
      draft.isLoading = true;
      break;
    case actionTypes.KEYVAULT_LOAD_MNEMONIC_SUCCESS:
      draft.mnemonic = action.payload;
      draft.isLoading = initialState.isLoading;
      break;
    case actionTypes.KEYVAULT_SAVE_MNEMONIC_SUCCESS:
      draft.isLoading = initialState.isLoading;
      break;
    case actionTypes.KEYVAULT_LOAD_LATEST_VERSION_SUCCESS:
      draft.latestVersion = action.payload;
      draft.isLoading = initialState.isLoading;
      break;
    case actionTypes.KEYVAULT_LOAD_MNEMONIC_FAILURE:
    case actionTypes.KEYVAULT_SAVE_MNEMONIC_FAILURE:
    case actionTypes.KEYVAULT_LOAD_LATEST_VERSION_FAILURE:
    case actionTypes.KEYVAULT_VALIDATE_PASSPHRASE_FAILURE:
      draft.error = action.payload.message;
      draft.isLoading = initialState.isLoading;
      break;
    case actionTypes.KEYVAULT_CLEAR_DATA:
    case LOGOUT:
      draft.isLoading = initialState.isLoading;
      draft.error = initialState.error;
      draft.cloudProvider = initialState.cloudProvider;
      draft.mnemonic = initialState.mnemonic;
      draft.latestVersion = initialState.latestVersion;
      break;
  }
});

type Action = {
  type: string;
  payload: any;
};

export default KeyVaultManagementReducer;
