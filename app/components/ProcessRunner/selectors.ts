export const getName = (state) => state.processRunner.name;

export const getMessage = (state) => state.processRunner.message;

export const getData = (state) => state.processRunner.data;

export const getIsLoading = (state) => state.processRunner.isLoading;

export const getIsDone = (state) => state.processRunner.isDone;

export const getIsServerActive = (state) => state.processRunner.isServerActive;

export const getError = (state) => state.processRunner.error;

export const getOverallSteps = (state) => state.processRunner.overallSteps;

export const getCurrentStep = (state) => state.processRunner.currentStep;
