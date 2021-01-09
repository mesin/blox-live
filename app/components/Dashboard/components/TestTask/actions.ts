import * as actionTypes from './actionTypes';

export const saveImages = (payload: Record<string, any>) => ({
  type: actionTypes.TEST_SAVE_IMAGES,
  payload: payload.images
});

export const showImages = () => ({
  type: actionTypes.TEST_SHOW_IMAGES,
});
