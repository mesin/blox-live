import React, { useState } from 'react';
import { SmallModal, WelcomeModal, RestartingModal,
         SuccessModal, ReinstallingModal, FailureModal, ThankYouModal } from '../KeyVaultModals/Modals';

const KeyVaultReactivation = ({onClose}: Props) => {
  const [step, setStep] = useState(0);
  const move1StepForward = () => setStep(step + 1);
  const move2StepsForward = () => setStep(step + 2);
  const contactSupport = () => { move1StepForward(); };
  switch (step) {
    case 0:
      return <SmallModal onClick={move1StepForward} onClose={onClose} />;
    case 1:
      return <WelcomeModal onClick={move1StepForward} onClose={onClose} />;
    case 2:
      return <RestartingModal move1StepForward={move1StepForward} move2StepsForward={move2StepsForward} onClose={onClose} />;
    case 3:
      return <SuccessModal onClose={onClose} />;
    case 4:
      return (
        <ReinstallingModal title={'Reinstalling KeyVault'} description={'KeyVault still inactive. Starting the reinstall process.'}
          move1StepForward={move1StepForward} move2StepsForward={move2StepsForward} onClose={onClose}
        />
      );
    case 5:
      return <SuccessModal title={'Reactivating your KeyVault'} onClose={onClose} />;
    case 6:
      return <FailureModal title={'Troubleshooting Failed'} onClick={contactSupport} onClose={onClose} />;
    case 7:
      return <ThankYouModal onClose={onClose} />;
    default:
      return <SmallModal onClick={move1StepForward} onClose={onClose} />;
  }
};

type Props = {
  onClose: () => void;
};

export default KeyVaultReactivation;
