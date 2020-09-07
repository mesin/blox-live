import produce from 'immer';
import * as actionTypes from './actionTypes';

const initialState = {
  type: '',
  show: false,
  text: '',

  showReactivation: false,
  showUpdate: false,
  showDepositInfo: false,
  showAddValidator: false,
};

/* eslint-disable default-case, no-param-reassign */
const dashboardReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.SET_MODAL_DISPLAY:
      draft.type = action.payload.type;
      draft.show = action.payload.show;
      draft.text = action.payload.text;
      break;
    case actionTypes.TOGGLE_REACTIVATION_MODAL_DISPLAY:
      draft.showReactivation = action.payload;
      break;
    case actionTypes.TOGGLE_UPDATE_MODAL_DISPLAY:
      draft.showUpdate = action.payload;
      break;
    case actionTypes.TOGGLE_DEPOSIT_INFO_MODAL_DISPLAY:
      draft.showDepositInfo = action.payload;
      break;
    case actionTypes.TOGGLE_ADD_VALIDATOR_MODAL_DISPLAY:
      draft.showAddValidator = action.payload;
      break;
  }
});

type Action = {
  type: string;
  payload: any;
};

export default dashboardReducer;
