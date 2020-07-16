import {
  LOGIN_INIT,
  LOGIN_SET_ID_TOKEN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from './actionTypes';

export const login = () => ({ type: LOGIN_INIT });

export const loginSuccess = (idTokenPayload) => ({
  type: LOGIN_SUCCESS,
  payload: idTokenPayload,
});

export const loginFailure = (error: Record<string, any>) => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const setIdToken = (idToken: string) => ({
  type: LOGIN_SET_ID_TOKEN,
  payload: idToken,
});
