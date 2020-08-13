import * as actionTypes from './actionTypes';

export const keyvaultSetCouldProvider = (couldProvider: string) => ({
  type: actionTypes.KEYVAULT_SET_COLUD_PROVIDER,
  payload: couldProvider,
});

export const keyvaultLoadMnemonic = () => ({
  type: actionTypes.KEYVAULT_LOAD_MNEMONIC,
});

export const keyvaultLoadMnemonicSuccess = (mnemonic: string) => ({
  type: actionTypes.KEYVAULT_LOAD_MNEMONIC_SUCCESS,
  payload: mnemonic,
});

export const keyvaultLoadMnemonicFailure = (error: Record<string, any>) => ({
  type: actionTypes.KEYVAULT_LOAD_MNEMONIC_FAILURE,
  payload: error,
});

export const keyvaultSaveMnemonic = (mnemonic: string, password: string) => ({
  type: actionTypes.KEYVAULT_SAVE_MNEMONIC,
  payload: { mnemonic, password },
});

export const keyvaultSaveMnemonicSuccess = () => ({
  type: actionTypes.KEYVAULT_SAVE_MNEMONIC_SUCCESS,
});

export const keyvaultSaveMnemonicFailure = (error: Record<string, any>) => ({
  type: actionTypes.KEYVAULT_SAVE_MNEMONIC_FAILURE,
  payload: error,
});
