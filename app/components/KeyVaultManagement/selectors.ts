export const getIsLoading = (state) => state.keyvaultManagement.isLoading;

export const getError = (state) => state.keyvaultManagement.error;

export const getCloudProvider = (state) => state.keyvaultManagement.cloudProvider;

export const getMnemonic = (state) => state.keyvaultManagement.mnemonic;

export const getLatestVersion = (state) => state.keyvaultManagement && state.keyvaultManagement.latestVersion;
