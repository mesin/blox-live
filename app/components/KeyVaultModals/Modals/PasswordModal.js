import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Title, Description } from '..';
import ModalTemplate from '../ModalTemplate';
import { PasswordInput, Button } from 'common/components';

import image from '../../Wizard/assets/img-password.svg';

const PasswordModal = (props) => {
  const { onClose, move1StepForward } = props;
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

  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Enter your password</Title>
      <Description>Critical actions require an extra layer of security.</Description>
      <PasswordInput name={'password'} onChange={setPassword} value={password}
        onBlur={onPasswordBlur} error={showPasswordError ? 'The password is too short' : ''}
      />
      <a href={process.env.DISCORD_INVITE} target={'_blank'}>Forgot password?</a>
      <Button isDisabled={isButtonDisabled} onClick={() => move1StepForward()}>Continue</Button>
    </ModalTemplate>
  );
};

PasswordModal.propTypes = {
  onClose: PropTypes.func,
  move1StepForward: PropTypes.func,
};

export default PasswordModal;
