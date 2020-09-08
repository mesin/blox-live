import React from 'react';
import { Date, Type, Description} from './components';

export default [
  {
    key: 'createdAt',
    title: '',
    width: '15%',
    valueRender: (createdAt) => <Date createdAt={createdAt} />,
  },
  {
    key: 'type',
    title: '',
    width: '25%',
    valueRender: (type) => <Type type={type} />,
  },
  {
    key: 'description',
    title: '',
    width: '60%',
    valueRender: (description) => <Description value={description} />,
  },
];
