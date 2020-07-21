import { call, put, select, takeLatest } from 'redux-saga/effects';
import { notification } from 'antd';
import MetaMask from './Metamask';

import { SEND_ETH_FROM_METAMASK } from './actionTypes';
import * as actions from './actions';
import { getDepositData } from '../Wizard/selectors';

const metamask = new MetaMask();

function* onSendEthersSuccess(response) {
  yield put(actions.sendEthFromMetaMaskSuccess(response));
}

function* onSendEthersFailure(error) {
  yield put(actions.sendEthFromMetaMaskFailure(error));
  notification.error({ message: 'Error', description: error.message });
}

export function* sendEthers() {
  const dataAndValue = yield select(getDepositData);
  try {
    const accounts = yield call(metamask.enableAccounts);
    const response = yield call(metamask.sendEthersTo, dataAndValue, accounts);
    yield call(onSendEthersSuccess, response);
  } catch (error) {
    yield error && call(onSendEthersFailure, error);
  }
}

export default function* metaMaskActions() {
  yield takeLatest(SEND_ETH_FROM_METAMASK, sendEthers);
}
