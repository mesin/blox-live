import React, { useState } from 'react';
import { SmallModal, WelcomeModal, RestartingModal, ReinstallingModal } from './components/Modals';

const Reactivation = ({onClose}: Props) => {
  const [step, setStep] = useState(0);
  const moveForward = () => setStep(step + 1);
  switch (step) {
    case 0:
      return <SmallModal onClick={moveForward} onClose={onClose} />;
    case 1:
      return <WelcomeModal onClick={moveForward} onClose={onClose} />;
    case 2:
      return <RestartingModal moveForward={moveForward} onClose={onClose} />;
    case 3:
      return <ReinstallingModal moveForward={moveForward} onClose={onClose} />;
    default:
      return <SmallModal onClick={moveForward} onClose={onClose} />;
  }
};

type Props = {
  onClose: () => void;
};

export default Reactivation;
