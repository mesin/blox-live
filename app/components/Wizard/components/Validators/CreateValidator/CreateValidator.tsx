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
import { getNetwork } from '../../../selectors';
import Store from 'backend/common/store-manager/store';

const store: Store = Store.getStore();

const key = 'processRunner';

const CreateValidator = (props: Props) => {
  const { page, setPage, actions, isLoading, selectedNetwork,
          validatorData, callLoadDepositData, callSetDepositNeeded, error } = props;
  const { processSubscribe, processClearState } = actions;
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  useInjectSaga({ key, saga, mode: '' });

  useEffect(() => {
    if (!isLoading && validatorData) { // TODO: replace with isDone
      const accountIndex = +validatorData.name.replace('account-', '');
      callLoadDepositData(validatorData.publicKey, accountIndex, validatorData.network);
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
    const { publicKey, network } = validatorData;
    const accountIndex = +validatorData.name.replace('account-', '');
    callSetDepositNeeded({isNeeded: true, publicKey, accountIndex, network});
    setPage(page + 1);
  };

  return (
    <>
      {validatorData && !error ? (
        <KeysGenerated onClick={onContinueClick} validatorData={validatorData} />
      ) : (
        <GenerateKeys onClick={onGenerateKeysClick} isLoading={isLoading} error={error}
          showPasswordModal={showPasswordModal} setShowPasswordModal={setShowPasswordModal}
          network={selectedNetwork}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: State) => ({
  isLoading: selectors.getIsLoading(state),
  validatorData: selectors.getData(state),
  error: selectors.getError(state),
  selectedNetwork: getNetwork(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(processRunnerActions, dispatch),
  callLoadDepositData: (publicKey, accountIndex, network) => dispatch(loadDepositData(publicKey, accountIndex, network)),
  callSetDepositNeeded: (payload: DepositNeededPayload) => dispatch(setDepositNeeded(payload)),
});

type Props = {
  page: number;
  network: string;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  isLoading: boolean;
  actions: Record<string, any>;
  validatorData: Record<string, any> | null;
  callLoadDepositData: (publicKey: string, accountIndex: number, network: string) => void;
  callSetDepositNeeded: (payload: DepositNeededPayload) => void;
  error: string;
};

type DepositNeededPayload = {
  isNeeded: boolean;
  publicKey: string;
  accountIndex: number;
  network: string;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(CreateValidator);
