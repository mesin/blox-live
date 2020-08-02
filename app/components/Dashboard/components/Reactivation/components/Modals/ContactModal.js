import React from 'react';
import PropTypes from 'prop-types';
import ModalTemplate from '../ModalTemplate';
import image from '../../../../../Wizard/assets/img-key-vault-inactive.svg';
import { Title, Description, Button } from '..';

const ContactModal = ({onClose}) => {
  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Contact us</Title>
      <Description>
        KeyVault is active and all validators are staking normally. We are investigating what caused the issue.
      </Description>
      <Button onClick={onClose}>Return to Dashboard</Button>
    </ModalTemplate>
  );
};

ContactModal.propTypes = {
  onClose: PropTypes.func,
};

export default ContactModal;
