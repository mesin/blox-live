import produce from 'immer';
import * as actionTypes from './actionTypes';
// import SendImagesProcess from '../../../../backend/proccess-manager/send-images.process';

const initialState = {
  images: [],
  onSuccess: null,
};

/* eslint-disable default-case, no-param-reassign */
const testTaskReducer = (state = initialState, action: Action) => produce(state, (draft) => {
  switch (action.type) {
    case actionTypes.TEST_SAVE_IMAGES:
      draft.images = action.payload;
  }
});

type Action = {
  type: string;
  payload: any;
};

export default testTaskReducer;
