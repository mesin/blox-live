import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Title, Description } from '..';
import ModalTemplate from '../ModalTemplate';
import { PasswordInput, Button } from 'common/components';
import * as keyvaultActions from '../../KeyVaultManagement/actions';

import image from '../../Wizard/assets/img-password.svg';

const PasswordModal = (props) => {
  const { onClose, onClick, actions } = props;
  const { keyvaultValidatePassword } = actions;
  const [password, setPassword] = useState('');
  const [showPasswordError, setPasswordErrorDisplay] = useState(false);
  const isButtonDisabled = !password || showPasswordError;

  const onPasswordBlur = () => {
    if (password.length < 8) {
      setPasswordErrorDisplay(true);
    }
    else {
      setPasswordErrorDisplay(false);
    }
  };

  const onButtonClick = () => {
    const isValid = keyvaultValidatePassword(password);
    console.log('isValid', isValid);
    debugger;
    onClick();
  };

  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Enter your password</Title>
      <Description>Critical actions require an extra layer of security.</Description>
      <PasswordInput name={'password'} onChange={setPassword} value={password}
        onBlur={onPasswordBlur} error={showPasswordError ? 'The password is too short' : ''}
      />
      <a href={process.env.DISCORD_INVITE} target={'_blank'}>Forgot password?</a>
      <Button isDisabled={isButtonDisabled} onClick={onButtonClick}>Continue</Button>
    </ModalTemplate>
  );
};

PasswordModal.propTypes = {
  onClose: PropTypes.func,
  onClick: PropTypes.func,
  actions: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(keyvaultActions, dispatch),
});

export default connect(null, mapDispatchToProps)(PasswordModal);
