import React from 'react';
import styled from 'styled-components';
import { ModalTemplate, Button, PasswordInput } from 'common/components';
import { Title, Description } from 'common/components/ModalTemplate/components';
import useCreateServer from 'common/hooks/useCreateServer';

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

const Step1Modal = ({onClick, onClose}: Props) => {
  const onStart = () => onClick();

  const { accessKeyId, setAccessKeyId, secretAccessKey, setSecretAccessKey,
          onStartProcessClick, isPasswordInputDisabled, isButtonDisabled
        } = useCreateServer({onStart});

  return (
    <ModalTemplate height={'560px'} padding={'30px 32px 30px 64px'} justifyContent={'initial'} onClose={onClose} image={image}>
      <Title>Recover Account Data</Title>
      <StepIndicator>Step 02</StepIndicator>
      <Description>
        Importing your data to recover your account is an automated <br />
        process that only takes a few minutes. Provide access to your <br />
        AWS tokens below for Blox to complete this step
      </Description>
      <PasswordInputsWrapper>
        <PasswordInput name={'accessKeyId'} title={'Access Key ID'} autoFocus
          onChange={setAccessKeyId} value={accessKeyId} isDisabled={isPasswordInputDisabled}
        />
        <PasswordInput name={'secretAccessKey'} title={'Secret Access Key'} width={'320px'}
          onChange={setSecretAccessKey} value={secretAccessKey} isDisabled={isPasswordInputDisabled}
        />
      </PasswordInputsWrapper>
      <ButtonWrapper>
        <Button onClick={onStartProcessClick} isDisabled={isButtonDisabled}>Continue</Button>
      </ButtonWrapper>
    </ModalTemplate>
  );
};

type Props = {
  onClick: () => void;
  onClose: () => void;
};

export default Step1Modal;
