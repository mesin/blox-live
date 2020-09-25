export type State = {
  isLoading: boolean;
  isUpdateLoading: boolean;
  data: {
    name: string;
    id: number;
    creatorId: number;
    createdAt: Date | string;
  };
  error: string;
  eventLogs: any;
  isLoadingEventLogs: boolean;
  eventLogsError: string;
  activeValidators: [],
};

export type Action = {
  type: string;
  payload: any;
};
