import * as actionTypes from './actionTypes';

export const loadBloxLiveVersion = () => ({ type: actionTypes.LOAD_BLOX_LIVE_VERSION });

export const loadBloxLiveVersionSuccess = (version: string) => ({
  type: actionTypes.LOAD_BLOX_LIVE_VERSION_SUCCESS,
  payload: version
});

export const loadBloxLiveVersionFailure = (error: Record<string, any>) => ({
  type: actionTypes.LOAD_BLOX_LIVE_VERSION_FAILURE,
  payload: { ...error }
});
