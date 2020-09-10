import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Title, Description } from '..';
import ModalTemplate from '../ModalTemplate';
import { PasswordInput, Button } from 'common/components';
import * as keyvaultActions from '../../KeyVaultManagement/actions';
import * as selectors from '../../KeyVaultManagement/selectors';

import image from '../../Wizard/assets/img-password.svg';

const PasswordModal = (props) => {
  const { onClose, onClick, isPasswordValid, actions } = props;
  const { keyvaultCheckPasswordValidation, keyvaultClearPasswordData } = actions;
  const [password, setPassword] = useState('');
  const [isButtonClicked, setButtonClicked] = useState(false);
  const [showTooShortPasswordError, setTooShortPasswordErrorDisplay] = useState(false);
  const [showWrongPasswordError, setWrongPasswordErrorDisplay] = useState(false);
  const isButtonDisabled = !password || password.length < 8 || showTooShortPasswordError;

  React.useEffect(() => {
    if (isButtonClicked) {
      if (isPasswordValid) {
        setWrongPasswordErrorDisplay(false);
        onClick();
        keyvaultClearPasswordData();
        onClose();
      }
      else {
        setWrongPasswordErrorDisplay(true);
      }
    }
  }, [isPasswordValid, isButtonClicked]);

  const onPasswordBlur = () => {
    if (password.length < 8) { setTooShortPasswordErrorDisplay(true); }
    else { clearErrors(); }
  };

  const onButtonClick = () => {
    if (!isButtonDisabled) {
      setButtonClicked(true);
      keyvaultCheckPasswordValidation(password);
    }
  };

  const clearErrors = () => {
    setTooShortPasswordErrorDisplay(false);
    setWrongPasswordErrorDisplay(false);
    setButtonClicked(false);
  };

  const errorsHandler = () => {
    if (showTooShortPasswordError) {
      return 'The password is too short';
    }
    if (showWrongPasswordError) {
      return 'Wrong password';
    }
    return '';
  };

  const error = errorsHandler();

  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Enter your password</Title>
      <Description>Critical actions require an extra layer of security.</Description>
      <PasswordInput name={'password'} onChange={setPassword} value={password} isValid={isPasswordValid}
        onBlur={onPasswordBlur} error={error}
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
  isPasswordValid: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isPasswordValid: selectors.getPasswordValidationStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(keyvaultActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordModal);
