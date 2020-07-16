import * as actionTypes from './actionTypes';

export const checkIfMetaMaskExist = (isExist: boolean) => ({
  type: actionTypes.CHECK_IF_METAMASK_EXIST,
  payload: isExist,
});

export const enableMetaMask = () => ({
  type: actionTypes.CHECK_IF_METAMASK_EXIST,
});

export const subscrbieToMetaMaskEvents = () => ({
  type: actionTypes.SUBSCRIBE_TO_METAMASK_EVENTS,
});

export const loadMetaMaskAccounts = () => ({
  type: actionTypes.LOAD_METAMASK_ACCOUNTS,
});

export const loadMetaMaskSuccess = (accounts: []) => ({
  type: actionTypes.LOAD_METAMASK_ACCOUNTS_SUCCESS,
  payload: accounts,
});

export const loadMetaMaskFailure = (error: string) => ({
  type: actionTypes.LOAD_METAMASK_ACCOUNTS_FAILURE,
  payload: error,
});

export const sendEthFromMetaMask = () => ({
  type: actionTypes.SEND_ETH_FROM_METAMASK,
});

export const sendEthFromMetaMaskSuccess = (txHash: string) => ({
  type: actionTypes.SEND_ETH_FROM_METAMASK_SUCCESS,
  payload: txHash,
});

export const sendEthFromMetaMaskFailure = (error: string) => ({
  type: actionTypes.SEND_ETH_FROM_METAMASK_FAILURE,
  payload: error,
});
