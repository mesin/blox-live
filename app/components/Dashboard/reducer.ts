import produce from 'immer';
import * as actionTypes from './actionTypes';

const initialState = {
  type: '',
  show: false,
  text: '',
};

/* eslint-disable default-case, no-param-reassign */
const dashboardReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.SET_MODAL_DISPLAY:
      draft.type = action.payload.type;
      draft.show = action.payload.show;
      draft.text = action.payload.text;
      break;
  }
});

type Action = {
  type: string;
  payload: any;
};

export default dashboardReducer;
