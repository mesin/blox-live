import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { loadDepositData } from '../../../actions';
import { setDepositNeeded } from '../../../../Accounts/actions';
import { getNetwork } from '../../../selectors';

import useProcessRunner from 'components/ProcessRunner/useProcessRunner';
import usePasswordHandler from '../../../../PasswordHandler/usePasswordHandler';

import { GenerateKeys, KeysGenerated } from './components';

const CreateValidator = (props: Props) => {
  const { isLoading, isDone, processData, error, startProcess, clearProcessState } = useProcessRunner();
  const { checkIfPasswordIsNeeded } = usePasswordHandler();
  const { page, setPage, callLoadDepositData, callSetDepositNeeded, selectedNetwork } = props;

  useEffect(() => {
    if (isDone && processData && !error) {
      const accountIndex = +processData.name.replace('account-', '');
      callLoadDepositData(processData.publicKey, accountIndex, processData.network);
    }
  }, [isLoading, processData, error]);

  const onGenerateKeysClick = () => {
    const onSuccess = () => {
      if (error) {
        clearProcessState();
      }
      if (!isLoading) {
        startProcess('createAccount', 'Generating Validator Keys...', null);
      }
    };
    checkIfPasswordIsNeeded(onSuccess);
  };

  const onContinueClick = () => {
    const { publicKey, network } = processData;
    const accountIndex = +processData.name.replace('account-', '');
    callSetDepositNeeded({isNeeded: true, publicKey, accountIndex, network});
    setPage(page + 1);
  };

  return (
    <>
      {processData && !error ? (
        <KeysGenerated onClick={onContinueClick} validatorData={processData} />
      ) : (
        <GenerateKeys network={selectedNetwork} onClick={onGenerateKeysClick} isLoading={isLoading} error={error} />
      )}
    </>
  );
};

const mapStateToProps = (state: State) => ({
  selectedNetwork: getNetwork(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  callLoadDepositData: (publicKey, accountIndex, network) => dispatch(loadDepositData(publicKey, accountIndex, network)),
  callSetDepositNeeded: (payload: DepositNeededPayload) => dispatch(setDepositNeeded(payload)),
});

type Props = {
  page: number;
  network: string;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  processData: Record<string, any> | null;
  callLoadDepositData: (publicKey: string, accountIndex: number, network: string) => void;
  callSetDepositNeeded: (payload: DepositNeededPayload) => void;
  selectedNetwork: string;
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
