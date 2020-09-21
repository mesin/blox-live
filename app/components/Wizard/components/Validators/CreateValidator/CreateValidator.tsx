import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useInjectSaga } from 'utils/injectSaga';
import * as processRunnerActions from '../../../../ProcessRunner/actions';
import * as selectors from '../../../../ProcessRunner/selectors';
import saga from '../../../../ProcessRunner/saga';
import { loadDepositData } from '../../../actions';
import { setDepositNeeded } from '../../../../Accounts/actions';
import { GenerateKeys, KeysGenerated } from './components';
import Store from 'backend/common/store-manager/store';

const store: Store = Store.getStore();

const key = 'processRunner';

const CreateValidator = (props: Props) => {
  const { page, setPage, actions, isLoading, validatorData, callLoadDepositData, callSetDepositNeeded, error } = props;
  const { processSubscribe, processClearState } = actions;
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);

  useInjectSaga({ key, saga, mode: '' });

  useEffect(() => {
    if (!isLoading && validatorData) {
      callLoadDepositData(validatorData.publicKey);
    }
  }, [isLoading, validatorData]);

  const onGenerateKeysClick = () => {
    if (!store.isCryptoKeyStored()) {
      setShowPasswordModal(true);
      return;
    }

    setShowPasswordModal(false);
    if (error) {
      processClearState();
    }
    if (!isLoading) {
      processSubscribe('createAccount', 'Generating Validator Keys...');
    }
  };

  const onContinueClick = () => {
    callSetDepositNeeded(true, validatorData.publicKey);
    setPage(page + 1);
  };

  return (
    <>
      {validatorData && !error ? (
        <KeysGenerated onClick={onContinueClick} validatorData={validatorData} />
      ) : (
        <GenerateKeys onClick={onGenerateKeysClick} isLoading={isLoading} error={error}
          showPasswordModal={showPasswordModal} setShowPasswordModal={setShowPasswordModal}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: State) => ({
  isLoading: selectors.getIsLoading(state),
  validatorData: selectors.getData(state),
  error: selectors.getError(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(processRunnerActions, dispatch),
  callLoadDepositData: (publicKey) => dispatch(loadDepositData(publicKey)),
  callSetDepositNeeded: (isNeeded, publicKey) => dispatch(setDepositNeeded(isNeeded, publicKey)),
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
  callSetDepositNeeded: (arg0: boolean, publicKey: string) => void;
  error: string;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(CreateValidator);
