import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import * as processRunnerActions from '../../../../ProcessRunner/actions';
import * as selectors from '../../../../ProcessRunner/selectors';
import saga from '../../../../ProcessRunner/saga';
import { loadDepositData } from '../../../actions';
import { GenerateKeys, KeysGenerated } from './components';

const key = 'processRunner';

const CreateValidator = (props: Props) => {
  const { page, setPage, actions, isLoading, validatorData, callLoadDepositData } = props;
  const { processSubscribe } = actions;

  useInjectSaga({ key, saga, mode: '' });

  useEffect(() => {
    if (!isLoading && validatorData) {
      callLoadDepositData(validatorData.publicKey);
    }
  }, [isLoading, validatorData]);

  const onGenerateKeysClick = () => {
    if (!isLoading) {
      processSubscribe('createAccount', 'Generating Validator Keys...');
    }
  };

  const onContinueClick = () => {
    setPage(page + 1);
  };

  return (
    <>
      {validatorData ? (
        <KeysGenerated onClick={onContinueClick} validatorData={validatorData} />
      ) : (
        <GenerateKeys onClick={onGenerateKeysClick} isLoading={isLoading} />
      )}
    </>
  );
};

const mapStateToProps = (state: State) => ({
  isLoading: selectors.getIsLoading(state),
  validatorData: selectors.getData(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(processRunnerActions, dispatch),
  callLoadDepositData: (publicKey) => dispatch(loadDepositData(publicKey)),
});

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  isLoading: boolean;
  actions: Record<string, any>;
  validatorData: Record<string, any> | null;
  callLoadDepositData: (publicKey: string) => void;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(CreateValidator);
