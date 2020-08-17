import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import * as currentActions from '../../../../ProcessRunner/actions';
import * as selectors from '../../../../ProcessRunner/selectors';
import saga from '../../../../ProcessRunner/saga';
import { loadDepositData } from '../../../actions';
import { GenerateKeys, KeysGenerated } from './components';

const key = 'processRunner';

const CreateValidator = (props: Props) => {
  const { page, setPage, actions, isLoading, message, validatorData, callLoadDepositData } = props;
  const { processSubscribe } = actions;

  useInjectSaga({ key, saga, mode: '' });

  useEffect(() => {
    if (!isLoading && validatorData) {
      callLoadDepositData();
    }
  }, [isLoading, validatorData]);

  const onGenerateKeysClick = () => {
    processSubscribe('createAccount', 'Generating Validator Keys...');
  };

  const onContinueClick = () => {
    setPage(page + 1);
  };

  return (
    <>
      {validatorData ? (
        <KeysGenerated onClick={onContinueClick} validatorData={validatorData} />
      ) : (
        <GenerateKeys onClick={onGenerateKeysClick} isLoading={isLoading} message={message} />
      )}
    </>
  );
};

const mapStateToProps = (state: State) => ({
  isLoading: selectors.getIsLoading(state),
  validatorData: selectors.getData(state),
  message: selectors.getMessage(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(currentActions, dispatch),
  callLoadDepositData: () => dispatch(loadDepositData()),
});

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  isLoading: boolean;
  actions: Record<string, any>;
  validatorData: Record<string, any> | null;
  message: string;
  callLoadDepositData: () => void;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(CreateValidator);
