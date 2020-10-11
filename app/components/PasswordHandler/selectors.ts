export const getPasswordValidationStatus = (state) => state.password && state.password.isValid;

export const getPasswordValidationLoadingStatus = (state) => state.password && state.password.isLoading;
