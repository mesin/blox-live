import React from 'react';
import {KeyCell, Status, Change, Apr, Balance} from './components';
import { compareFunction } from 'common/components/Table/service';

export default [
  {
    key: 'key',
    title: 'Public Key',
    width: '40%',
    justifyContent: 'flex-start',
    compareFunction: (a, b, dir) => compareFunction('publicKey', a, b, dir, 'string'),
    valueRender: (value) => <KeyCell value={value} />,
  },
  {
    key: 'currentBalance',
    title: 'Balance',
    width: '15%',
    justifyContent: 'flex-end',
    compareFunction: (a, b, dir) => compareFunction('currentBalance', a, b, dir, 'number'),
    valueRender: (balance) => <Balance balance={balance} />,
  },
  {
    key: 'change',
    title: 'Change',
    width: '15%',
    justifyContent: 'flex-end',
    compareFunction: (a, b, dir) => compareFunction('change', a, b, dir, 'number'),
    valueRender: (change) => <Change change={change} />,
  },
  {
    key: 'apr',
    title: 'Est. APR(%)',
    width: '18%',
    justifyContent: 'flex-end',
    compareFunction: (a, b, dir) => compareFunction('apr', a, b, dir, 'number'),
    valueRender: (change) => <Apr change={change} />,
  },
  {
    key: 'status',
    title: 'Status',
    width: '12%',
    justifyContent: 'flex-end',
    compareFunction: (a, b, dir) => compareFunction('status', a, b, dir, 'string'),
    valueRender: (value) => <Status status={value} />,
  }
];
