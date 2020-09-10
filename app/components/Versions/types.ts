export type State = {
  isLoadingBloxLiveVersion: boolean,
  bloxLiveVersionError: string,
  bloxLiveVersion: string,
};

export type Action = {
  type: string;
  payload: any;
};
