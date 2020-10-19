import * as actionTypes from './actionTypes';

export const loadAccounts = () => ({ type: actionTypes.LOAD_ACCOUNTS });

export const loadAccountsSuccess = (accounts: Record<string, any>) => ({
  type: actionTypes.LOAD_ACCOUNTS_SUCCESS,
  payload: accounts
});

export const loadAccountsFailure = (error: Record<string, any>) => ({
  type: actionTypes.LOAD_ACCOUNTS_FAILURE,
  payload: { ...error }
});

export const setDepositNeeded = (payload: DepositNeededPayload) => ({
  type: actionTypes.SET_DEPOSIT_NEEDED, payload
});

export const setAddAnotherAccount = (addAnotherAccount: boolean) => ({
  type: actionTypes.ADD_ANOTHER_ACCOUNT,
  payload: addAnotherAccount
});

export const clearAccountsData = () => ({ type: actionTypes.CLEAR_DATA });

type DepositNeededPayload = {
  isNeeded: boolean;
  publicKey: string;
  accountIndex: number;
  network: string;
};
