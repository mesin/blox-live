import React from 'react';
import PropTypes from 'prop-types';
import ModalTemplate from '../ModalTemplate';
import { Title, Description, Button } from '..';

import image from '../../../../../Wizard/assets/img-key-vault-inactive.svg';

const ThankYouModal = ({onClose}) => {
  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Thank You!</Title>
      <Description>
        We will contact you as soon as possible
      </Description>
      <Button onClick={onClose}>Close</Button>
    </ModalTemplate>
  );
};

ThankYouModal.propTypes = {
  onClose: PropTypes.func,
};

export default ThankYouModal;
