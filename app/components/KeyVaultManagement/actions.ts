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

export const keyvaultSaveMnemonic = (mnemonic: string) => ({
  type: actionTypes.KEYVAULT_SAVE_MNEMONIC,
  payload: { mnemonic },
});

export const keyvaultSaveMnemonicSuccess = () => ({
  type: actionTypes.KEYVAULT_SAVE_MNEMONIC_SUCCESS,
});

export const keyvaultSaveMnemonicFailure = (error: Record<string, any>) => ({
  type: actionTypes.KEYVAULT_SAVE_MNEMONIC_FAILURE,
  payload: error,
});

export const keyvaultLoadLatestVersion = () => ({
  type: actionTypes.KEYVAULT_LOAD_LATEST_VERSION,
});

export const keyvaultLoadLatestVersionSuccess = (version: string) => ({
  type: actionTypes.KEYVAULT_LOAD_LATEST_VERSION_SUCCESS,
  payload: version
});

export const keyvaultLoadLatestVersionFailure = (error: Record<string, any>) => ({
  type: actionTypes.KEYVAULT_LOAD_LATEST_VERSION,
  payload: error,
});

export const keyvaultValidatePassphrase = (passphrase: string) => ({
  type: actionTypes.KEYVAULT_VALIDATE_PASSPHRASE,
  payload: passphrase,
});

export const keyvaultValidatePassphraseSuccess = () => ({
  type: actionTypes.KEYVAULT_VALIDATE_PASSPHRASE_SUCCESS,
});

export const keyvaultValidatePassphraseFailure = (error: Record<string, any>) => ({
  type: actionTypes.KEYVAULT_VALIDATE_PASSPHRASE_FAILURE,
  payload: error,
});

export const validateRecoveryCredentials = ({mnemonic, password}: Record<string, any>) => ({
  type: actionTypes.VALIDATE_RECOVERY_CREDENTIALS,
  payload: {mnemonic, password},
});

export const validateRecoveryCredentialsSuccess = () => ({
  type: actionTypes.VALIDATE_RECOVERY_CREDENTIALS_SUCCESS,
});

export const validateRecoveryCredentialsFailure = (error: Record<string, any>) => ({
  type: actionTypes.VALIDATE_RECOVERY_CREDENTIALS_FAILURE,
  payload: error,
});

export const clearRecoveryCredentialsState = () => ({
  type: actionTypes.VALIDATE_RECOVERY_CREDENTIALS_CLEAR,
});

export const validateAwsKeys = (keys: Record<string, any>) => ({
  type: actionTypes.VALIDATE_AWS_KEYS,
  payload: keys,
});

export const validateAwsKeysSuccess = () => ({
  type: actionTypes.VALIDATE_AWS_KEYS_SUCCESS,
});

export const validateAwsKeysFailure = (error: Record<string, any>) => ({
  type: actionTypes.VALIDATE_AWS_KEYS_FAILURE,
  payload: error,
});

export const clearAwsKeysState = () => ({
  type: actionTypes.VALIDATE_AWS_KEYS_CLEAR,
});

export const keyvaultClearData = () => ({ type: actionTypes.KEYVAULT_CLEAR_DATA });
