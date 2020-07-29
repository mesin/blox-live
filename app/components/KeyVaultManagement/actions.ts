import * as actionTypes from './actionTypes';

export const keyvaultRestart = () => ({
  type: actionTypes.KEYVAULT_RESTART,
});

export const keyvaultRestartSubscribe = (credentials: Record<string, any>) => ({
  type: actionTypes.KEYVAULT_RESTART_SUBSCRIBE,
  payload: credentials
});

export const keyvaultRestartUnSubscribe = () => ({
  type: actionTypes.KEYVAULT_RESTART_UNSUBSCRIBE,
});

export const keyvaultRestartSuccess = () => ({
  type: actionTypes.KEYVAULT_RESTART_SUCCESS,
});

export const keyvaultRestartFailure = (error: Record<string, any>) => ({
  type: actionTypes.KEYVAULT_RESTART_FAILURE,
  payload: error
});
