import React from 'react';
import styled from 'styled-components';

import { Spinner } from 'common/components';
import { Title, Paragraph, BigButton, Link, ErrorMessage } from '../../../common';
import { openExternalLink } from '../../../../../common/service';
import PasswordModal from '../../../../../KeyVaultModals/Modals/PasswordModal';

const Wrapper = styled.div``;

const ButtonWrapper = styled.div`
  margin-bottom: 12px;
`;

const LoaderWrapper = styled.div`
  max-width:500px;
  display:flex;
`;

const LoaderText = styled.span`
  margin-left: 11px;
  font-size: 12px;
  color: ${({ theme }) => theme.primary900};
`;

const GenerateKeys = (props: Props) => {
  const { isLoading, onClick, error, showPasswordModal, setShowPasswordModal } = props;
  return (
    <Wrapper>
      <Title>Create TestNet Validator</Title>
      <Paragraph>
        Now we must generate your secure validator keys to begin creating your{' '}
        <br />
        Testnet validator. These keys will be generated securely using KeyVault.{' '}
        <br />
        <Link onClick={() => openExternalLink('guides/what-is-a-validator-key')}>What is a validator key?</Link>
      </Paragraph>
      <ButtonWrapper>
        <BigButton isDisabled={isLoading} onClick={onClick}>
          Generate Validator Keys
        </BigButton>
      </ButtonWrapper>
      {isLoading && (
        <LoaderWrapper>
          <Spinner width="17px" />
          <LoaderText>Generating Validator Keys...</LoaderText>
        </LoaderWrapper>
      )}
      {error && (
        <ErrorMessage>
          {error}, please try again.
        </ErrorMessage>
      )}
      {showPasswordModal && (<PasswordModal onClose={() => setShowPasswordModal(false)} />)}
    </Wrapper>
  );
};

type Props = {
  isLoading: boolean;
  onClick: () => void;
  error: string;
  showPasswordModal: boolean;
  setShowPasswordModal: (arg0: boolean) => void;
};

export default GenerateKeys;
