import React, { useState } from 'react';
import { SmallModal, WelcomeModal, RestartingModal, PasswordModal,
         SuccessModal, ReinstallingModal, FailureModal, ThankYouModal } from '../KeyVaultModals/Modals';

const KeyVaultReactivation = ({onClose}: Props) => {
  const [step, setStep] = useState(1);
  const move1StepForward = () => setStep(step + 1);
  const move2StepsForward = () => setStep(step + 2);
  const contactSupport = () => { move1StepForward(); };
  switch (step) {
    case 1:
      return <WelcomeModal onClick={move1StepForward} onClose={onClose} />;
    case 2:
      return <PasswordModal onClose={onClose} onClick={move1StepForward} />;
    case 3:
      return <RestartingModal move1StepForward={move1StepForward} move2StepsForward={move2StepsForward} />;
    case 4:
      return <SuccessModal title={'KeyVault Reactivated!'} onClose={onClose} />;
    case 5:
      return (
        <ReinstallingModal title={'Reinstalling KeyVault'} description={'KeyVault still inactive. Starting the reinstall process.'}
          move1StepForward={move1StepForward} move2StepsForward={move2StepsForward}
        />
      );
    case 6:
      return <SuccessModal title={'Reactivating your KeyVault'} onClose={onClose} />;
    case 7:
      return <FailureModal title={'Troubleshooting Failed'} onClick={contactSupport} onClose={onClose} />;
    case 8:
      return <ThankYouModal onClose={onClose} />;
    default:
      return <SmallModal onClick={move1StepForward} onClose={onClose} />;
  }
};

type Props = {
  onClose: () => void;
};

export default KeyVaultReactivation;
