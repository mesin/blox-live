import React from 'react';
import PropTypes from 'prop-types';
import { Button, FailureIcon } from 'common/components';
import ModalTemplate from '../ModalTemplate';
import { Title, Description, Wrapper, DiscordText } from '..';
import { version } from '../../../package.json';

import image from '../../Wizard/assets/img-key-vault-inactive.svg';
import discordLogo from 'assets/images/discord-logo.svg';
import OrganizationService from '../../../backend/services/organization/organization.service';
import Store from '../../../backend/common/store-manager/store';

const reportCrash = async () => {
  const organizationService = new OrganizationService();
  const store = Store.getStore();
  await organizationService.reportCrash({
    keyVaultVersion: store.get('keyVaultVersion'),
    appVersion: version
  });
};

const FailureModal = ({title, onClick, onClose}) => {
  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Wrapper>
        <FailureIcon size={'40px'} fontSize={'30px'} />
        <Title fontSize={'32px'} color={'warning900'}>{title}</Title>
      </Wrapper>
      <Description>
        Please contact our support team to resolve this issue.
      </Description>
      <Wrapper>
        <Button onClick={async () => {
          await reportCrash();
          onClick();
        }}>Contact Blox</Button> <br />
        <DiscordText>Or reach us on <img src={discordLogo} /></DiscordText>
      </Wrapper>
    </ModalTemplate>
  );
};

FailureModal.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};

export default FailureModal;
