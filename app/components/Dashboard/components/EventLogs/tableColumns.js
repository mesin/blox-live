import React from 'react';
import Date from '../Validators/components/KeyCell/components/Date';

export default [
  {
    key: 'createdAt',
    title: 'createdAt',
    width: '20%',
    isSort: true,
    valueRender: (value) => {
      return <Date value={value} />;
    },
  }
];
