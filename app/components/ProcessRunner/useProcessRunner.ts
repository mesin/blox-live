import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import * as selectors from './selectors';
import { processSubscribe, processClearState } from './actions';
import saga from './saga';
import { useInjectSaga } from 'utils/injectSaga';
import { precentageCalculator } from 'utils/service';

type Steps = {
  overallSteps: number;
  currentStep: number;
};

type Props = {
  processMessage: string;
  isLoading: boolean;
  isDone: boolean;
  isServerActive: boolean;
  processData: Record<string, any>;
  error: string;
};

type StartProcess = (name: string, defaultMessage: string, credentials: Record<string, any> | null) => void;
type ClearProcess = () => void;

const {
  getMessage, getIsLoading, getIsDone, getIsServerActive,
  getOverallSteps, getCurrentStep, getError, getData
} = selectors;

const dispatch = useDispatch();

const useProcessRunner = () => {
  useInjectSaga({key: 'processRunner', saga, mode: ''});

  const props: Props = {
    processMessage: useSelector(getMessage, shallowEqual),
    isLoading: useSelector(getIsLoading, shallowEqual),
    isDone: useSelector(getIsDone, shallowEqual),
    isServerActive: useSelector(getIsServerActive, shallowEqual),
    processData: useSelector(getData, shallowEqual),
    error: useSelector(getError, shallowEqual)
  };

  const steps: Steps = {
    overallSteps: useSelector(getOverallSteps, shallowEqual),
    currentStep: useSelector(getCurrentStep, shallowEqual),
  };
  const loaderPrecentage = precentageCalculator(steps.currentStep, steps.overallSteps);

  const startProcess: StartProcess = async (name, defaultMessage, credentials) => {
    await dispatch(processSubscribe(name, defaultMessage, credentials));
  };

  const clearProcessState: ClearProcess = () => dispatch(processClearState());

  return { ...props, loaderPrecentage, startProcess, clearProcessState };
};

export default useProcessRunner;
