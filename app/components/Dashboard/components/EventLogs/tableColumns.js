import React from 'react';
import { Date, Type, Description} from './components';

export default [
  {
    key: 'createdAt',
    title: '',
    width: '18%',
    valueRender: (createdAt) => <Date createdAt={createdAt} />,
  },
  {
    key: 'type',
    title: '',
    width: '26%',
    valueRender: (type) => <Type type={type} />,
  },
  {
    key: 'description',
    title: '',
    width: '56%',
    valueRender: (description) => <Description value={description} />,
  },
];
