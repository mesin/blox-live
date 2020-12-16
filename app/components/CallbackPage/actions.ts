import * as actionTypes from './actionTypes';

export const login = (connectionName: string) => ({
  type: actionTypes.LOGIN_INIT,
  payload: connectionName,
});

export const setSession = (idToken: string) => ({
  type: actionTypes.LOGIN_SET_SESSION,
  payload: idToken,
});

export const loginSuccess = (idTokenPayload) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: idTokenPayload,
});

export const loginFailure = (error: Record<string, any>) => ({
  type: actionTypes.LOGIN_FAILURE,
  payload: error,
});

export const setIdToken = (idToken: string) => ({
  type: actionTypes.LOGIN_SET_ID_TOKEN,
  payload: idToken,
});

export const logout = () => ({
  type: actionTypes.LOGOUT,
});
