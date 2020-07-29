import produce from 'immer';
import * as actionTypes from './actionTypes';

const initialState = {
  isLoading: false,
  message: '',
  error: null,
};

const KeyVaultManagementReducer = (state = initialState, action: Action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.KEYVAULT_RESTART:
        draft.isLoading = true;
        break;
      case actionTypes.KEYVAULT_RESTART_SUCCESS:
        draft.isLoading = false;
        draft.message = initialState.message;
        break;
      case actionTypes.KEYVAULT_RESTART_FAILURE:
        draft.isLoading = false;
        draft.error = action.payload.message;
        draft.message = initialState.message;
        break;
      case actionTypes.KEYVAULT_RESTART_SUBSCRIBE:
        draft.message = action.payload.message;
        break;
    }
  });

type Action = {
  type: string;
  payload: any;
};

export default KeyVaultManagementReducer;
