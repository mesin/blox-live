import produce from 'immer';
import * as actionTypes from './actionTypes';
import {State, Action} from './types';

export const initialState: State = {
  isLoadingBloxLiveVersion: false,
  bloxLiveVersionError: '',
  bloxLiveVersion: '',
};

/* eslint-disable default-case, no-param-reassign */
const versionsReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.LOAD_BLOX_LIVE_VERSION:
      draft.isLoadingBloxLiveVersion = true;
      break;
    case actionTypes.LOAD_BLOX_LIVE_VERSION_SUCCESS:
      draft.bloxLiveVersion = action.payload;
      draft.isLoadingBloxLiveVersion = false;
      break;
    case actionTypes.LOAD_BLOX_LIVE_VERSION_FAILURE:
      draft.bloxLiveVersionError = action.payload;
      draft.isLoadingBloxLiveVersion = false;
      break;
  }
});

export default versionsReducer;
