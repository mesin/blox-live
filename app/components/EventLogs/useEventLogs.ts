import { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import * as selectors from './selectors';
import { loadEventLogs } from './actions';
import saga from './saga';
import { useInjectSaga } from 'utils/injectSaga';

const { getEventLogs, getEventLogsLoadingStatus, getEventLogsError } = selectors;

const useEventLogs = () => {
  useInjectSaga({key: 'eventLogs', saga, mode: ''});

  const eventLogs: [] = useSelector(getEventLogs, shallowEqual);
  const isLoadingEventLogs: boolean = useSelector(getEventLogsLoadingStatus, shallowEqual);
  const eventLogsError: string = useSelector(getEventLogsError, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!eventLogs && !isLoadingEventLogs && !eventLogsError) {
      dispatch(loadEventLogs());
    }
  }, [isLoadingEventLogs]);

  return { eventLogs, isLoadingEventLogs, eventLogsError };
};

export default useEventLogs;
