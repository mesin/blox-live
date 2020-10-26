import React from 'react';
import styled from 'styled-components';
import { ModalTemplate, Button, PasswordInput } from 'common/components';
import useCreatePassword from 'common/hooks/useCreatePassword';

import { Title, Description } from 'common/components/ModalTemplate/components';
import { TextArea } from '../../Wizard/components/common';

import image from 'assets/images/img-recovery.svg';

const StepIndicator = styled.div`
  font-size: 12px;
  font-weight: 500;
  color:${({theme}) => theme.gray400};
  margin-bottom:8px;
`;

const PasswordInputsWrapper = styled.div`
  width: 400px;
  margin-top:21px;
  display: flex;
  justify-content:space-between;
  font-size: 16px;
  font-weight: 500;
`;

const ButtonWrapper = styled.div`
  margin-top:41px;
  margin-bottom:41px;
`;

const Step1Modal = ({onClick, onClose}: Props) => { // TODO: add mnemonic logic
  const { password, setPassword, confirmPassword, setConfirmPassword, showPasswordError,
    showConfirmPasswordError, onPasswordBlur, onConfirmPasswordBlur
  } = useCreatePassword();

  return (
    <ModalTemplate height={'560px'} padding={'30px 32px 30px 64px'} justifyContent={'initial'} onClose={onClose} image={image}>
      <Title>Recover Account Data</Title>
      <StepIndicator>Step 01</StepIndicator>
      <Description>
        To recover your account, enter your secret 24-word <br />
        passphrase and set a new password for in-app activity. <br />
        DO NOT share your passphrase or password with anyone! <br />
        Doing so will provide access to your staked funds.
      </Description>
      <TextArea width={'400px'} />
      <PasswordInputsWrapper>
        <PasswordInput name={'password'} width={'190px'} title={'Password (min 8 chars)'}
          onChange={setPassword} value={password} onBlur={onPasswordBlur}
          error={showPasswordError ? 'The password is too short' : ''}
        />
        <PasswordInput name={'confirmPassword'} width={'190px'} title={'Confirm Password'}
          onChange={setConfirmPassword} value={confirmPassword} onBlur={onConfirmPasswordBlur}
          error={showConfirmPasswordError ? 'Passwords don\'t match' : ''}
        />
      </PasswordInputsWrapper>
      <ButtonWrapper>
        <Button onClick={onClick} isDisabled>Save &amp; Confirm</Button>
      </ButtonWrapper>
    </ModalTemplate>
  );
};

type Props = {
  onClick: () => void;
  onClose: () => void;
};

export default Step1Modal;
