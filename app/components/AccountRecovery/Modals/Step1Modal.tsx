import React from 'react';
import styled from 'styled-components';
import { ModalTemplate, Button, PasswordInput } from 'common/components';
import useCreatePassword from 'common/hooks/useCreatePassword';

import { Title, Description } from 'common/components/ModalTemplate/components';

import image from 'assets/images/img-recovery.svg';

const PasswordInputsWrapper = styled.div`
  width: 454px;
  margin-top:41px;
  display: flex;
  justify-content:space-between;
  font-size: 16px;
  font-weight: 500;
`;

const Step1Modal = ({onClick}: Props) => {
  const { password, setPassword, confirmPassword, setConfirmPassword, showPasswordError,
    showConfirmPasswordError, onPasswordBlur, onConfirmPasswordBlur
  } = useCreatePassword();

  return (
    <ModalTemplate image={image}>
      <Title>Recover Account Data</Title>
      <span>Step 01</span>
      <Description>
        To recover your account, enter your secret 24-word <br />
        passphrase and set a new password for in-app activity. <br />
        DO NOT share your passphrase or password with anyone! <br />
        Doing so will provide access to your staked funds.
      </Description>
      <textarea />
      <PasswordInputsWrapper>
        <PasswordInput name={'password'} title={'Password (min 8 chars)'}
          onChange={setPassword} value={password} onBlur={onPasswordBlur}
          error={showPasswordError ? 'The password is too short' : ''}
        />
        <PasswordInput name={'confirmPassword'} title={'Confirm Password'}
          onChange={setConfirmPassword} value={confirmPassword} onBlur={onConfirmPasswordBlur}
          error={showConfirmPasswordError ? 'Passwords don\'t match' : ''}
        />
      </PasswordInputsWrapper>
      <Button onClick={onClick} isDisabled>Save &amp; Confirm</Button>
    </ModalTemplate>
  );
}

type Props = {
  onClick: () => void;
};

export default Step1Modal;
