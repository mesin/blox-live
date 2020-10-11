import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { loadDepositData } from '../../../actions';
import { setDepositNeeded } from '../../../../Accounts/actions';
import { getNetwork } from '../../../selectors';

import { GenerateKeys, KeysGenerated } from './components';
import Store from 'backend/common/store-manager/store';
import useProcessRunner from 'components/ProcessRunner/useProcessRunner';

const store: Store = Store.getStore();

const CreateValidator = (props: Props) => {
  const { isLoading, isDone, processData, error, startProcess, clearProcessState } = useProcessRunner();
  const { page, setPage, callLoadDepositData, callSetDepositNeeded } = props;
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);

  useEffect(() => {
    if (isDone && processData) {
      callLoadDepositData(processData.publicKey);
    }
  }, [isLoading, processData]);

  const onGenerateKeysClick = () => {
    if (!store.isCryptoKeyStored()) {
      setShowPasswordModal(true);
      return;
    }
    setShowPasswordModal(false);

    if (error) {
      clearProcessState();
    }
    if (!isLoading) {
      startProcess('createAccount', 'Generating Validator Keys...', null);
    }
  };

  const onContinueClick = () => {
    callSetDepositNeeded(true, processData.publicKey);
    setPage(page + 1);
  };

  return (
    <>
      {processData && !error ? (
        <KeysGenerated onClick={onContinueClick} validatorData={processData} />
      ) : (
        <GenerateKeys onClick={onGenerateKeysClick} isLoading={isLoading} error={error}
          showPasswordModal={showPasswordModal} setShowPasswordModal={setShowPasswordModal}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: State) => ({
  network: getNetwork(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  callLoadDepositData: (publicKey) => dispatch(loadDepositData(publicKey)),
  callSetDepositNeeded: (isNeeded, publicKey) => dispatch(setDepositNeeded(isNeeded, publicKey)),
});

type Props = {
  page: number;
  network: string;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  callLoadDepositData: (publicKey: string) => void;
  callSetDepositNeeded: (arg0: boolean, publicKey: string) => void;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(CreateValidator);
