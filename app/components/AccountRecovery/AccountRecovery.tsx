import React, { useState } from 'react';
import * as Modals from './Modals';
import { FailureModal } from '../KeyVaultModals';

const { WelcomeModal, Step1Modal, Step2Modal, RecoveringModal, SuccessModal } = Modals;

const AccountRecovery = ({onClose, type}: Props) => {
  const [step, setStep] = useState(0);
  const move1StepForward = () => setStep(step + 1);
  const move2StepsForward = () => setStep(step + 2);
  switch (step) {
    case 0:
      return <WelcomeModal onClose={onClose} onClick={move1StepForward} type={type} />;
    case 1:
      return <Step1Modal onClose={onClose} onClick={move1StepForward} />;
    case 2:
      return <Step2Modal onClose={onClose} onClick={move1StepForward} />;
    case 3:
      return <RecoveringModal move1StepForward={move1StepForward} move2StepsForward={move2StepsForward} />;
    case 4:
      return <SuccessModal />;
    case 5:
      return <FailureModal />;
    default:
      return <WelcomeModal onClose={onClose} onClick={move1StepForward} type={type} />;
  }
};

type Props = {
  onClose: () => void;
  type: string;
};

export default AccountRecovery;
