import React from 'react';
import styled from 'styled-components';
import Spinner from '../Spinner';
import ProgressBar from '../ProgressBar';

const Wrapper = styled.div`
  width:100%;
  display: flex;
  flex-direction: column;
  font-weight: 900;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 900;
  margin-top:7px;
`;

const Text = styled.div`
  margin-left: 11px;
  font-size: 12px;
  color: ${({ theme }) => theme.primary900};
`;

const ProcessLoader = ({ text, precentage }: Props) => (
  <Wrapper>
    <ProgressBar value={precentage} />
    <TextWrapper>
      <Spinner width={'17px'} />
      <Text>{precentage}% {text}</Text>
    </TextWrapper>
  </Wrapper>
);

type Props = {
  text: string;
  precentage: number;
};

export default ProcessLoader;
