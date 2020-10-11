import React, { useState } from 'react';
import { Modal } from './components';
import { PasswordModal } from '../KeyVaultModals/Modals';

const DepositInfoModal = ({onClose, depositData}: Props) => {
  const [step, setStep] = useState(1);
  const moveStepForward = () => setStep(step + 1);
  switch (step) {
    case 1:
      return <PasswordModal onClose={onClose} onClick={moveStepForward} />;
    case 2:
      return <Modal onClose={onClose} depositData={depositData} />;
    default:
      return <PasswordModal onClose={onClose} onClick={moveStepForward} />;
  }
};

type Props = {
  depositData: string;
  onClose: () => void;
};

export default DepositInfoModal;
