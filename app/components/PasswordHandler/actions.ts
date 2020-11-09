import * as actionTypes from './actionTypes';

export const savePassword = (password: string) => ({
  type: actionTypes.SAVE_PASSWORD,
  payload: password
});

export const replacePassword = (password: string) => ({
  type: actionTypes.REPLACE_PASSWORD,
  payload: password
});

export const savePasswordSuccess = () => ({ type: actionTypes.SAVE_PASSWORD_SUCCESS });

export const savePasswordFailure = (error: string) => ({ type: actionTypes.SAVE_PASSWORD_FAILURE, payload: error });

export const checkPasswordValidation = (password: string) => ({
  type: actionTypes.CHECK_PASSWORD_VALIDATION,
  payload: password
});

export const setPasswordValidation = (isValid: boolean) => ({
  type: actionTypes.SET_PASSWORD_VALIDATION,
  payload: isValid
});

export const checkIfPasswordNeeded = () => ({ type: actionTypes.CHECK_IF_PASSWORD_NEEDED });

export const clearPasswordData = () => ({ type: actionTypes.CLEAR_PASSWORD_DATA });
