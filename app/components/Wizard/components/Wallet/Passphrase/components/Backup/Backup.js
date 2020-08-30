import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Icon, Spinner, PasswordInput } from 'common/components';
import { Title, Paragraph, Warning, TextArea } from '../../../../common';

const Wrapper = styled.div`
  width: 100%;
  max-width:560px;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Avenir;
  font-size: 16px;
  font-weight: 500;
`;

const BackButton = styled.div`
  width:40px;
  display: flex;
  align-items:center;
  justify-content: space-between;
  color:${({theme}) => theme.primary900};
  font-size:12px;
  cursor:pointer;
`;

const IconWrapper = styled.div`
  transform:rotate(180deg);
`;

const PasswordInputsWrapper = styled.div`
  width: 454px;
  margin-top:41px;
  display: flex;
  justify-content:space-between;
  font-size: 16px;
  font-weight: 500;
`;

const ButtonWrapper = styled.div`
  margin-top:41px;
  margin-bottom:41px;
`;

const Backup = (props) => {
  const { onNextButtonClick, onBackButtonClick, password, setPassword, confirmPassword,
          setConfirmPassword, isSaveAndConfirmEnabled, duplicatedMnemonic, setDuplicatedMnemonic,
          isLoading, showDuplicatedMnemonicError, onDuplicateMnemonicBlur,
          showPasswordError, onPasswordBlur, showConfirmPasswordError, onConfirmPasswordBlur
        } = props;
  return (
    <Wrapper>
      <BackButton onClick={onBackButtonClick}>
        <IconWrapper>
          <Icon name={'arrow-forward'} color={'primary900'} />
        </IconWrapper>
        Back
      </BackButton>
      <Title>Backup Recovery Passphrase</Title>

      <Paragraph>
        Confirm your Passphrase and set a password for critical actions such as <br />
        creating/removing a validator.
      </Paragraph>

      <TextArea value={duplicatedMnemonic} onChange={setDuplicatedMnemonic} onBlur={onDuplicateMnemonicBlur}
        placeholder={'Separate each word with a space'} error={showDuplicatedMnemonicError ? 'Passphrase not correct' : ''}
      />

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

      <ButtonWrapper>
        <Button isDisabled={!isSaveAndConfirmEnabled()} onClick={onNextButtonClick}>Save &amp; Confirm</Button>
        {isLoading && <Spinner />}
      </ButtonWrapper>

      <Warning text={'The only way to restore your account or to reset your password is using your passphrase.'} />
    </Wrapper>
  );
};

Backup.propTypes = {
  onNextButtonClick: PropTypes.func,
  onBackButtonClick: PropTypes.func,
  password: PropTypes.string,
  setPassword: PropTypes.func,
  confirmPassword: PropTypes.string,
  setConfirmPassword: PropTypes.func,
  isSaveAndConfirmEnabled: PropTypes.func,
  duplicatedMnemonic: PropTypes.string,
  setDuplicatedMnemonic: PropTypes.func,
  isLoading: PropTypes.bool,
  showDuplicatedMnemonicError: PropTypes.bool,
  showPasswordError: PropTypes.bool,
  showConfirmPasswordError: PropTypes.bool,
  onDuplicateMnemonicBlur: PropTypes.func,
  onPasswordBlur: PropTypes.func,
  onConfirmPasswordBlur: PropTypes.func,
};

export default Backup;
