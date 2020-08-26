import produce from 'immer';
import * as actionTypes from './actionTypes';

const initialState = {
  showReactivation: false,
  showUpdate: false,
  showDepositInfo: false,
};

/* eslint-disable default-case, no-param-reassign */
const dashboardReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.TOGGLE_REACTIVATION_MODAL_DISPLAY:
      draft.showReactivation = action.payload;
      break;
    case actionTypes.TOGGLE_UPDATE_MODAL_DISPLAY:
      draft.showUpdate = action.payload;
      break;
    case actionTypes.TOGGLE_DEPOSIT_INFO_MODAL_DISPLAY:
      draft.showDepositInfo = action.payload;
      break;
  }
});

type Action = {
  type: string;
  payload: any;
};

export default dashboardReducer;
