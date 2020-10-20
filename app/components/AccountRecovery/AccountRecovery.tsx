import React, { useState } from 'react';
import { WelcomeModal, Step1Modal } from './Modals';

const AccountRecovery = ({onClose, type}: Props) => {
  const [step, setStep] = useState(0);
  const move1StepForward = () => setStep(step + 1);
  switch (step) {
    case 0:
      return <WelcomeModal onClose={onClose} onClick={move1StepForward} type={type} />;
    case 1:
      return <Step1Modal onClick={move1StepForward} />;
    case 2:
      return <>Recover account - step 2</>;
    case 3:
      return <>Recovering your account - (existing process)</>;
    case 4:
      return <>Account Recovered - (Success screen)</>;
    default:
      return <>Welcome screen</>;
  }
};

type Props = {
  onClose: () => void;
  type: string;
};

export default AccountRecovery;
