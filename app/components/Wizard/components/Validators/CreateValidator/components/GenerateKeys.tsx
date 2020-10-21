import React from 'react';
import styled from 'styled-components';

import { Spinner } from 'common/components';
import { Title, Paragraph, BigButton, Link, ErrorMessage } from '../../../common';
import { openExternalLink } from '../../../../../common/service';
import { NETWORKS } from '../../constants';

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
  const { isLoading, onClick, error, network } = props;
  return (
    <Wrapper>
      <Title>Create {NETWORKS[network].name} Validator</Title>
      <Paragraph>
        Now we must generate your secure validator keys to begin creating your{' '}
        <br />
        {NETWORKS[network].name} validator. These keys will be generated securely using KeyVault.{' '}
        <br />
        <Link onClick={() => openExternalLink('docs-guides/#pp-toc__heading-anchor-4')}>What is a validator key?</Link>
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
    </Wrapper>
  );
};

type Props = {
  isLoading: boolean;
  onClick: () => void;
  error: string;
  network: string
};

export default GenerateKeys;
