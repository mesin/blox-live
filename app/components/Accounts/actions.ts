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

export const setDepositNeeded = (depositNeeded: boolean) => ({
  type: actionTypes.SET_DEPOSIT_NEEDED,
  payload: depositNeeded
});

export const addAnotherAccount = () => ({ type: actionTypes.ADD_ANOTHER_ACCOUNT });

export const clearAccountsData = () => ({ type: actionTypes.CLEAR_DATA });
