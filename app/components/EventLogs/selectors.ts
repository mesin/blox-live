export const getEventLogs = (state: Record<string, any>) => state.eventLogs.data;

export const getEventLogsLoadingStatus = (state: Record<string, any>) => state.eventLogs.isLoadingEventLogs;

export const getEventLogsError = (state: Record<string, any>) => state.eventLogs.eventLogsError;

export const getActiveValidators = (state: Record<string, any>) => state.eventLogs.activeValidators;
