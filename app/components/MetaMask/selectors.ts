import { State } from './types';

export const getIsLoading = (metaMaskState: State) => metaMaskState.isLoading;

export const getErrorObject = (metaMaskState: State) => metaMaskState.error;

export const getIsExistStatus = (metaMaskState: State) => metaMaskState.isExist;

export const getIsExistCheckedStatus = (metaMaskState: State) => metaMaskState.isExistChecked;

export const getAccounts = (metaMaskState: State) => metaMaskState.accounts;

export const getTxHash = (metaMaskState: State) => metaMaskState.txHash;
