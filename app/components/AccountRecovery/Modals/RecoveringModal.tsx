import React, { useEffect } from 'react';
import { ProcessLoader, ModalTemplate } from 'common/components';
import { Title, SmallText, Wrapper } from 'common/components/ModalTemplate/components';
import useProcessRunner from 'components/ProcessRunner/useProcessRunner';

import image from 'assets/images/img-recovery.svg';

const RecoveringModal = (props: Props) => {
  const { isLoading, processMessage, isDone, isServerActive, clearProcessState, loaderPrecentage } = useProcessRunner();
  const { move1StepForward, move2StepsForward } = props;

  useEffect(() => {
    if (isDone) {
      clearProcessState();
      isServerActive ? move1StepForward() : move2StepsForward();
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
};

export default RecoveringModal;
