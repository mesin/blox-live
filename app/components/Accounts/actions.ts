import * as actionTypes from './actionTypes';

export const loadAccounts = () => ({ type: actionTypes.LOAD_ACCOUNTS });

export const loadAccountsSuccess = (accounts: Record<string, any>) => ({
  type: actionTypes.LOAD_ACCOUNTS_SUCCESS,
  payload: accounts,
});

export const loadAccountsFailure = (error: Record<string, any>) => ({
  type: actionTypes.LOAD_ACCOUNTS_FAILURE,
  payload: { ...error },
});

export const deleteAccount = (accountId: number) => ({
  type: actionTypes.DELETE_ACCOUNT,
  payload: accountId,
});

export const deleteAccountSuccess = () => ({
  type: actionTypes.DELETE_ACCOUNT_SUCCESS,
});

export const deleteAccountFailure = (error: Record<string, any>) => ({
  type: actionTypes.DELETE_ACCOUNT_FAILURE,
  payload: { ...error },
});

export const clearAccountsData = () => ({ type: actionTypes.CLEAR_DATA });
