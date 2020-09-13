export const getLatestBloxLiveVersion = (state: Record<string, any>) => state.versions && state.versions.bloxLiveVersion;
export const getLatestBloxLiveVersionLoadingStatus = (state: Record<string, any>) => state.versions && state.versions.isLoadingBloxLiveVersion;
export const getLatestBloxLiveVersionError = (state: Record<string, any>) => state.versions && state.versions.bloxLiveVersionError;
