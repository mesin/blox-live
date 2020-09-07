import * as actionTypes from './actionTypes';

export const setModalDisplay = (payload: Record<string, any>) => ({
  type: actionTypes.SET_MODAL_DISPLAY, payload
});

export const setReactivationModalDisplay = (show: boolean) => ({
  type: actionTypes.TOGGLE_REACTIVATION_MODAL_DISPLAY,
  payload: show
});

export const setUpdateModalDisplay = (show: boolean) => ({
  type: actionTypes.TOGGLE_UPDATE_MODAL_DISPLAY,
  payload: show
});

export const setDepositInfoModalDisplay = (show: boolean) => ({
  type: actionTypes.TOGGLE_DEPOSIT_INFO_MODAL_DISPLAY,
  payload: show
});

export const setAddValidatorModalDisplay = (show: boolean) => ({
  type: actionTypes.TOGGLE_ADD_VALIDATOR_MODAL_DISPLAY,
  payload: show
});
