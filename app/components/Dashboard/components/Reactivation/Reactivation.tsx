import React, { useState } from 'react';
import { SmallModal, WelcomeModal, RestartingModal,
         ReactivatedModal, ReinstallingModal, ContactModal, ThankYouModal } from './components/Modals';

const Reactivation = ({onClose}: Props) => {
  const [step, setStep] = useState(0);
  const move1StepForward = () => setStep(step + 1);
  // const move2StepsForward = () => setStep(step + 2);
  const contactSupport = () => {
    console.log('contact support');
    move1StepForward();
  };
  switch (step) {
    case 0:
      return <SmallModal onClick={move1StepForward} onClose={onClose} />;
    case 1:
      return <WelcomeModal onClick={move1StepForward} onClose={onClose} />;
    case 2:
      return <RestartingModal move1StepForward={move1StepForward} onClose={onClose} />;
    case 3:
      return <ReinstallingModal move1StepForward={move1StepForward} onClose={onClose} />;
    case 4:
      return <ReactivatedModal onClose={onClose} />;
    case 5:
      return <ContactModal onClick={contactSupport} onClose={onClose} />;
    case 6:
      return <ThankYouModal onClose={onClose} />;
    default:
      return <SmallModal onClick={move1StepForward} onClose={onClose} />;
  }
};

type Props = {
  onClose: () => void;
};

export default Reactivation;
