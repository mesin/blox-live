import produce from 'immer';
import * as actionTypes from './actionTypes';
import {State, Action} from './types';

export const initialState: State = {
  isLoading: false,
  isUpdateLoading: false,
  data: {
    name: '',
    id: 0,
    creatorId: 0,
    createdAt: '',
  },
  error: '',
};

/* eslint-disable default-case, no-param-reassign */
const organizationReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.SET_ORGANIZATION_NAME:
      draft.data.name = action.payload;
      break;
    case actionTypes.LOAD_ORGANIZATION:
      draft.isLoading = true;
      break;
    case actionTypes.LOAD_ORGANIZATION_SUCCESS:
      draft.data = action.payload;
      draft.isLoading = false;
      break;
    case actionTypes.LOAD_ORGANIZATION_FAILURE:
      draft.isLoading = false;
      break;
    case actionTypes.UPDATE_ORGANIZATION:
      draft.isUpdateLoading = true;
      break;
    case actionTypes.UPDATE_ORGANIZATION_SUCCESS:
      draft.isUpdateLoading = false;
      draft.data = action.payload;
      break;
    case actionTypes.UPDATE_ORGANIZATION_FAILURE:
      draft.isUpdateLoading = false;
      draft.error = action.payload;
      break;
  }
});

export default organizationReducer;
