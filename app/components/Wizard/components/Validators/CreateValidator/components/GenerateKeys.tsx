import React from 'react';
import styled from 'styled-components';
import { ProcessLoader } from 'common/components';
import { Title, Paragraph, BigButton, Link } from '../../../common';

const Wrapper = styled.div``;

const ButtonWrapper = styled.div`
  margin-bottom: 12px;
`;

const LoaderWrapper = styled.div`
  max-width:500px;
`;

const GenerateKeys = (props: Props) => {
  const { isLoading, message, onClick } = props;
  return (
    <Wrapper>
      <Title>Create TestNet Validator</Title>
      <Paragraph>
        Now we must generate your secure validator keys to begin creating your{' '}
        <br />
        Testnet validator. These keys will be generated securely using KeyVault.{' '}
        <br />
        <Link href={'https://www.bloxstaking.com/blox-guide-what-is-a-validator-key'} target={'_blank'}>
          What is a validator key?
        </Link>
      </Paragraph>
      <ButtonWrapper>
        <BigButton onClick={onClick}>
          Generate Validator Keys
        </BigButton>
      </ButtonWrapper>
      {isLoading && (
        <LoaderWrapper>
          <ProcessLoader text={message} />
        </LoaderWrapper>
      )}
    </Wrapper>
  );
};

type Props = {
  isLoading: boolean;
  message: string;
  onClick: () => void;
};

export default GenerateKeys;
