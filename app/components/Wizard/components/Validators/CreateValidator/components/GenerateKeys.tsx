import React from 'react';
import styled from 'styled-components';
import { Title, Paragraph, BigButton, Link, Connection } from '../../../common';

const Wrapper = styled.div``;

const ButtonWrapper = styled.div`
  margin-bottom: 12px;
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
        <Link href="/">What is a validator key?</Link>
      </Paragraph>
      <ButtonWrapper>
        <BigButton onClick={onClick}>
          Generate Validator Keys
        </BigButton>
      </ButtonWrapper>
      {isLoading && <Connection text={message} />}
    </Wrapper>
  );
};

type Props = {
  isLoading: boolean;
  message: string;
  onClick: () => void;
};

export default GenerateKeys;
