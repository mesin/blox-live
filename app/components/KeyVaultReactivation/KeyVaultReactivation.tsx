import React, { useState } from 'react';
import { WelcomeModal, RestartingModal, PasswordModal,
         SuccessModal, ReinstallingModal, FailureModal, ThankYouModal } from '../KeyVaultModals/Modals';

import inactiveImage from '../Wizard/assets/img-key-vault-inactive.svg';

const successText = 'KeyVault is active and all validators are staking normally. We are investigating what caused the issue.';

const KeyVaultReactivation = ({onClose}: Props) => {
  const [step, setStep] = useState(1);
  const move1StepForward = () => setStep(step + 1);
  const move2StepsForward = () => setStep(step + 2);
  switch (step) {
    case 1:
      return <WelcomeModal onClick={move1StepForward} onClose={onClose} />;
    case 2:
      return <PasswordModal onClose={onClose} onClick={move1StepForward} />;
    case 3:
      return <RestartingModal move1StepForward={move1StepForward} move2StepsForward={move2StepsForward} />;
    case 4:
      return <SuccessModal title={'KeyVault Reactivated!'} onClose={onClose} text={successText} />;
    case 5:
      return (
        <ReinstallingModal title={'Reinstalling KeyVault'} description={'KeyVault still inactive. Starting the reinstall process.'}
          move1StepForward={move1StepForward} move2StepsForward={move2StepsForward} image={inactiveImage}
        />
      );
    case 6:
      return <SuccessModal title={'Reactivating your KeyVault'} onClose={onClose} text={successText} />;
    case 7:
      return <FailureModal title={'Troubleshooting Failed'} onClick={move1StepForward} onClose={onClose} />;
    case 8:
      return <ThankYouModal onClose={onClose} />;
    default:
      return <WelcomeModal onClick={move1StepForward} onClose={onClose} />;
  }
};

type Props = {
  onClose: () => void;
};

export default KeyVaultReactivation;
