import produce from 'immer';
import * as actionTypes from './actionTypes';

const initialState = {
  isLoading: false,
  isDone: false,
  name: '',
  message: '',
  error: '',
};

const KeyVaultManagementReducer = (state = initialState, action: Action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actionTypes.KEYVAULT_PROCESS_SUBSCRIBE:
        draft.isLoading = true;
        draft.name = action.payload.name;
        draft.message = action.payload.defaultMessage;
        break;
      case actionTypes.KEYVAULT_PROCESS_OBSERVE:
        draft.message = action.payload;
        break;
      case actionTypes.KEYVAULT_PROCESS_UNSUBSCRIBE:
        draft.isLoading = initialState.isLoading;
        draft.name = initialState.name;
        draft.message = initialState.message;
        draft.isDone = true;
        break;
      case actionTypes.KEYVAULT_PROCESS_FAILURE:
        draft.error = action.payload.message;
        draft.isLoading = initialState.isLoading;
        draft.name = initialState.name;
        draft.message = initialState.message;
        draft.isDone = true;
        break;
      case actionTypes.KEYVAULT_PROCESS_CLEAR_STATE:
        draft.isDone = initialState.isDone;
        break;
    }
  });

type Action = {
  type: string;
  payload: any;
};

export default KeyVaultManagementReducer;
