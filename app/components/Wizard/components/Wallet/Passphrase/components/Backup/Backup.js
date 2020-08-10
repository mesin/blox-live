import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from 'common/components';
import { Title, Paragraph, Warning } from '../../../../common';

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

const Textarea = styled.textarea``;

const ButtonWrapper = styled.div`
  margin-top:45px;
`;

const Backup = (props) => {
  const { onNextButtonClick } = props;
  return (
    <Wrapper>
      <Title>Backup Recovery Passphrase</Title>
      <Paragraph>
        Confirm your Passphrase and set a password for critical actions such as <br />
        creating/removing a validator.
      </Paragraph>
      <Textarea>Separate each word with a space</Textarea>
      <ButtonWrapper>
        <Button isDisabled onClick={onNextButtonClick}>Save &amp; Confirm</Button>
      </ButtonWrapper>
      <Warning text={'The only way to restore your account or to reset your password is using your passphrase.'} />
    </Wrapper>
  );
};

Backup.propTypes = {
  onNextButtonClick: PropTypes.func,
};

export default Backup;
