import * as actionTypes from './actionTypes';

export const setModalDisplay = (payload: Record<string, any>) => ({
  type: actionTypes.SET_MODAL_DISPLAY, payload
});
