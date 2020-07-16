export const getAccounts = (state: Record<string, any>) =>
  state.accounts && state.accounts.data;

export const getAccountsLoadingStatus = (state: Record<string, any>) =>
  state.accounts && state.accounts.isLoading;

export const getAccountsError = (state: Record<string, any>) =>
  state.accounts && state.accounts.error;
