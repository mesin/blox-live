import React from 'react';
import loadable from 'utils/loadable';
import LoadingIndicator from '../common/LoadingIndicator';

export default loadable(() => import('./index'), {
  fallback: <LoadingIndicator />,
});
