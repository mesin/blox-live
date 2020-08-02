import React from 'react';
import PropTypes from 'prop-types';
import { SuccessIcon } from 'common/components';
import ModalTemplate from '../ModalTemplate';
import image from '../../../../../Wizard/assets/img-key-vault.svg';
import { Title, Description, Button, Wrapper } from '..';

const ReactivatedModal = ({onClose}) => {
  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Wrapper>
        <SuccessIcon size={'40px'} fontSize={'30px'} />
        <Title fontSize={'32px'} color={'accent2400'}>Reactivating your KeyVault</Title>
      </Wrapper>
      <Description>
        KeyVault is active and all validators are staking normally. We are investigating what caused the issue.
      </Description>
      <Button onClick={onClose}>Return to Dashboard</Button>
    </ModalTemplate>
  );
};

ReactivatedModal.propTypes = {
  onClose: PropTypes.func,
};

export default ReactivatedModal;
