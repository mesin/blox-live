import React, { useEffect } from 'react';
import { ProcessLoader, ModalTemplate } from 'common/components';
import { Title, SmallText, Wrapper } from 'common/components/ModalTemplate/components';
import useProcessRunner from 'components/ProcessRunner/useProcessRunner';
import Store from 'backend/common/store-manager/store';

import { MODAL_TYPES } from '../../Dashboard/constants';

import image from 'assets/images/img-recovery.svg';

const RecoveringModal = (props: Props) => {
  const { isLoading, processMessage, isDone, isServerActive, clearProcessState, loaderPrecentage } = useProcessRunner();
  const { move1StepForward, move2StepsForward, type } = props;

  const onSuccess = () => {
    move1StepForward();
    const store: Store = Store.getStore();
    if (type === MODAL_TYPES.DEVICE_SWITCH) {
      store.delete('inRecoveryProcess');
    }
    else if (type === MODAL_TYPES.FORGOT_PASSWORD) {
      store.delete('inForgotPasswordProcess');
    }
  };

  const onFailure = () => move2StepsForward();

  useEffect(() => {
    if (isDone) {
      clearProcessState();
      isServerActive ? onSuccess() : onFailure();
    }
  }, [isLoading, isDone, processMessage]);

  return (
    <ModalTemplate image={image}>
      <Title>Recovering Your Account</Title>
      <Wrapper>
        <ProcessLoader text={processMessage} precentage={loaderPrecentage} />
      </Wrapper>
      <SmallText withWarning />
    </ModalTemplate>
  );
};

type Props = {
  move1StepForward: () => void;
  move2StepsForward: () => void;
  type: string;
};

export default RecoveringModal;
