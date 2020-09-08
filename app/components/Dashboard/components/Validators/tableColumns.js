import React from 'react';
// import { ClickAwayListener } from '@material-ui/core';
// eslint-disable-next-line import/named
import {KeyCell, Status/* , Misc */, Change, Apr, Balance} from './components';

export default [
  {
    key: 'key',
    title: 'Key',
    width: '35%',
    isSort: true,
    valueRender: (value) => {
      return <KeyCell value={value} />;
    },
  },
  {
    key: 'currentBalance',
    title: 'Balance',
    width: '15%',
    isSort: true,
    valueRender: (balance) => <Balance balance={balance} />,
  },
  {
    key: 'change',
    title: 'Change',
    width: '15%',
    isSort: true,
    valueRender: (change) => <Change change={change} />,
  },
  {
    key: 'apr',
    title: 'Est. APR(%)',
    width: '15%',
    isSort: true,
    valueRender: (change) => <Apr change={change} />,
  },
  {
    key: 'status',
    title: 'Status',
    width: '10%',
    isSort: true,
    valueRender: (value) => <Status status={value} />,
  }/* ,
  {
    key: 'misc',
    title: '',
    width: '5%',
    valueRender: (misc) => (
      <ClickAwayListener>
        <Misc {...misc} />
      </ClickAwayListener>
    ),
  }, */
];
