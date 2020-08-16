import React from 'react';
import PropTypes from 'prop-types';
import { Button, FailureIcon } from 'common/components';
import ModalTemplate from '../ModalTemplate';
import { Title, Description, Wrapper, DiscordText } from '..';

import image from '../../../Wizard/assets/img-key-vault-inactive.svg';
import discordLogo from 'assets/images/discord-logo.svg';

const ContactModal = ({onClick, onClose}) => {
  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Wrapper>
        <FailureIcon size={'40px'} fontSize={'30px'} />
        <Title fontSize={'32px'} color={'warning900'}>Troubleshooting Failed</Title>
      </Wrapper>
      <Description>
        Please contact our support team to resolve this issue.
      </Description>
      <Wrapper>
        <Button onClick={onClick}>Contact Blox</Button> <br />
        <DiscordText>Or reach us on <img src={discordLogo} /></DiscordText>
      </Wrapper>
    </ModalTemplate>
  );
};

ContactModal.propTypes = {
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};

export default ContactModal;
