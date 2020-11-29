import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ModalTemplate, Button } from 'common/components';
import { Title, Description, SmallText } from 'common/components/ModalTemplate/components';
import { getModalText } from '../Dashboard/selectors';

import image from '../Wizard/assets/img-key-vault-inactive.svg';

const defaultText = `Due to KeyVault inactivity, your validators are not operating.
                    To fix this issue, we will restart your KeyVault.
                    If unsuccessful, a quick reinstall is required.`;

const WelcomeModal = ({onClick, onClose, text}) => {
  const textToShow = text !== '' ? text : defaultText;
  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Reactivating your KeyVault</Title>
      <Description>{textToShow}</Description>
      <SmallText />
      <Button onClick={onClick}>Reactivate KeyVault</Button>
    </ModalTemplate>
  );
};

WelcomeModal.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};

const mapStateToProps = (state) => ({
  text: getModalText(state),
});

export default connect(mapStateToProps)(WelcomeModal);
