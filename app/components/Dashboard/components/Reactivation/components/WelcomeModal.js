import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ModalTemplate from './ModalTemplate';
import image from '../../../../Wizard/assets/img-key-vault-inactive.svg';

const Title = styled.h1`
  font-size: 26px;
  font-weight: 900;
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.71;
  padding-bottom:24px;
`;

const SmallText = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({theme}) => theme.gray600};
  padding-bottom:54px;
`;

const Button = styled.button`
  width: 175px;
  height: 32px;
  font-size: 14px;
  font-weight: 900;
  display:flex;
  align-items:center;
  justify-content:center;
  background-color: ${({theme}) => theme.primary900};
  border-radius: 6px;
  color:${({theme}) => theme.gray50};
  border:0px;
`;

const WelcomeModal = ({onClick, onClose}) => {
  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Reactivating your KeyVault</Title>
      <Description>
        Due to KeyVault inactivity, your validators are not operating.
        To fix this issue, we will restart your KeyVault.
        If unsuccessful, a quick reinstall is required.
      </Description>
      <SmallText>This process is automated and only takes a few minutes.</SmallText>
      <Button onClick={onClick}>Reactivate KeyVault</Button>
    </ModalTemplate>
  )
};

WelcomeModal.propTypes = {
  onClick: PropTypes.func,
  onClose: PropTypes.func,
};

export default WelcomeModal;
