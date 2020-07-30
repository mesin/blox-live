import * as actionTypes from './actionTypes';

export const keyvaultProcessSubscribe = (name: string) => ({
  type: actionTypes.KEYVAULT_PROCESS_SUBSCRIBE,
  payload: name,
});

export const keyvaultProcessObserve = (message: string) => ({
  type: actionTypes.KEYVAULT_PROCESS_OBSERVE,
  payload: message,
});

export const keyvaultProcessUnSubscribe = () => ({
  type: actionTypes.KEYVAULT_PROCESS_UNSUBSCRIBE,
});

export const keyvaultProcessFailure = (error: Record<string, any>) => ({
  type: actionTypes.KEYVAULT_PROCESS_FAILURE,
  payload: error,
});
