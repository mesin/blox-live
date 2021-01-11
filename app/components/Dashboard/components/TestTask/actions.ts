import { MODAL_TYPES } from '../../constants';

export const showModalWithImages = (payload: Record<string, any>) => ({
  type: MODAL_TYPES.TEST_IMAGES_MODAL,
  payload: {
    images: payload
  }
});
