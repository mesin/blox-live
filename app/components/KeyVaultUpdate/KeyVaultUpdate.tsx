import React, { useState } from 'react';
import { SuccessModal, ReinstallingModal, FailureModal, ThankYouModal } from '../KeyVaultModals/Modals';

const KeyVaultUpdate = ({onClose}: Props) => {
  const [step, setStep] = useState(0);
  const move1StepForward = () => setStep(step + 1);
  const move2StepsForward = () => setStep(step + 2);
  const contactSupport = () => { move1StepForward(); };
  switch (step) {
    case 0:
      return (
        <ReinstallingModal title={'Updating KeyVault'} move1StepForward={move1StepForward}
          move2StepsForward={move2StepsForward} onClose={onClose}
        />
      );
    case 1:
      return <SuccessModal title={'Reactivating your KeyVault'} onClose={onClose} />;
    case 2:
      return <FailureModal title={'Troubleshooting Failed'} onClick={contactSupport} onClose={onClose} />;
    case 3:
      return <ThankYouModal onClose={onClose} />;
    default:
      return (
        <ReinstallingModal title={'Updating KeyVault'} move1StepForward={move1StepForward}
          move2StepsForward={move2StepsForward} onClose={onClose}
        />
      );
  }
};

type Props = {
  onClose: () => void;
};

export default KeyVaultUpdate;
