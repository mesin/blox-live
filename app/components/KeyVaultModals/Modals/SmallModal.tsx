import React from 'react';
import { Modal } from 'common/components';

const SmallModal = ({onClick, onClose}: Props) => {
  return (
    <Modal title={'Inactive KeyVault'} text={'Please reactivate your KeyVault before creating a new validator'}
      buttonText={'Reactivate KeyVault'} cancelButtonText={'Later'}
      onClick={onClick} onCloseClick={onClose} />
  );
};

type Props = {
  onClick: () => void;
  onClose: () => void;
};

export default SmallModal;
