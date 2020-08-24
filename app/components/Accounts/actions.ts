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
