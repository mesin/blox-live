import { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import * as selectors from './selectors';
import { loadBloxLiveVersion } from './actions';
import saga from './saga';
import { parseVersion } from './service';

import { useInjectSaga } from 'utils/injectSaga';
import { version } from 'package.json';

const { getLatestBloxLiveVersion, getLatestBloxLiveVersionLoadingStatus, getLatestBloxLiveVersionError } = selectors;

const useVersions = () => {
  useInjectSaga({key: 'versions', saga, mode: ''});

  const bloxLiveLatestVersion: string = useSelector(getLatestBloxLiveVersion, shallowEqual);
  const isLoadingBloxLiveVersion: boolean = useSelector(getLatestBloxLiveVersionLoadingStatus, shallowEqual);
  const bloxLiveVersionError: string = useSelector(getLatestBloxLiveVersionError, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!bloxLiveLatestVersion && !isLoadingBloxLiveVersion && !bloxLiveVersionError) {
      dispatch(loadBloxLiveVersion());
    }
  }, [isLoadingBloxLiveVersion]);

  const bloxLiveNeedsUpdate: boolean = parseVersion(version) !== parseVersion(bloxLiveLatestVersion);

  return { bloxLiveNeedsUpdate, isLoadingBloxLiveVersion };
};

export default useVersions;
