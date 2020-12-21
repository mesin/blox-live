import * as actionTypes from './actionTypes';

export const loadWallet = () => ({ type: actionTypes.LOAD_WALLET });

export const loadWalletSuccess = (payload: Record<string, any>) => ({
  type: actionTypes.LOAD_WALLET_SUCCESS,
  payload,
});

export const loadWalletFailure = (error: Record<string, any>) => ({
  type: actionTypes.LOAD_WALLET_FAILURE,
  payload: error,
});

export const setNetworkType = (networkType: string) => ({
  type: actionTypes.SET_NETWORK_TYPE,
  payload: networkType,
});

export const generateValidatorKey = () => ({
  type: actionTypes.GENERATE_VALIDATOR_KEY,
});

export const generateValidatorKeySuccess = (payload: Record<string, any>) => ({
  type: actionTypes.GENERATE_VALIDATOR_KEY_SUCCESS,
  payload,
});

export const generateValidatorKeyFailure = (error: Record<string, any>) => ({
  type: actionTypes.GENERATE_VALIDATOR_KEY_FAILURE,
  payload: error,
});

export const loadDepositData = (publicKey: string, accountIndex: number, network: string) => (
  { type: actionTypes.LOAD_DEPOSIT_DATA, payload: { publicKey, accountIndex, network } }
);

export const loadDepositDataSuccess = (payload: Record<string, any>) => ({
  type: actionTypes.LOAD_DEPOSIT_DATA_SUCCESS,
  payload,
});

export const loadDepositDataFailure = (error: Record<string, any>) => ({
  type: actionTypes.LOAD_DEPOSIT_DATA_FAILURE,
  payload: error,
});

export const clearDepositData = () => ({ type: actionTypes.CLEAR_DEPOSIT_DATA});

export const updateAccountStatus = (accountId: string, txHash: string) => ({
  type: actionTypes.UPDATE_ACCOUNT_STATUS,
  payload: {accountId, txHash},
});

export const updateAccountStatusSuccess = () => ({
  type: actionTypes.UPDATE_ACCOUNT_STATUS_SUCCESS,
});

export const updateAccountStatusFailure = (error: Record<string, any>) => ({
  type: actionTypes.UPDATE_ACCOUNT_STATUS_FAILURE,
  payload: error,
});

export const setFinishedWizard = (isFinished: boolean) => ({
  type: actionTypes.SET_FINISHED_WIZARD,
  payload: isFinished,
});

export const clearWizardData = () => ({
  type: actionTypes.CLEAR_DATA,
});
