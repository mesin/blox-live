import React, { useState } from 'react';
import { PasswordModal, SuccessModal, ReinstallingModal, FailureModal, ThankYouModal } from '../KeyVaultModals/Modals';

import activeImage from '../Wizard/assets/img-key-vault.svg';

const KeyVaultUpdate = ({onClose}: Props) => {
  const [step, setStep] = useState(0);
  const move1StepForward = () => setStep(step + 1);
  const move2StepsForward = () => setStep(step + 2);
  switch (step) {
    case 0:
      return <PasswordModal onClose={onClose} onClick={move1StepForward} />;
    case 1:
      return (
        <ReinstallingModal title={'Updating KeyVault'} move1StepForward={move1StepForward}
          move2StepsForward={move2StepsForward} image={activeImage}
        />
      );
    case 2:
      return <SuccessModal title={'KeyVault Updated!'} onClose={onClose} text={'All Validators are now performing normally.'} />;
    case 3:
      return <FailureModal title={'Troubleshooting Failed'} onClick={move1StepForward} onClose={onClose} />;
    case 4:
      return <ThankYouModal onClose={onClose} />;
    default:
      return <PasswordModal onClose={onClose} />;
  }
};

type Props = {
  onClose: () => void;
};

export default KeyVaultUpdate;
