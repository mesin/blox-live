import React from 'react';
import styled from 'styled-components';
import { MenuItem, SubMenuItem } from './components';

const Wrapper = styled.div`
  width: 19vw;
  height: 100%;
  padding: 60px 2.5vw;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.gray80015};
  margin: 24px 0px;
`;

const Navigation = (props: Props) => {
  const { page, step } = props;
  return (
    <Wrapper>
      <MenuItem text="KeyVault Setup" number={1} step={step} />
      <SubMenuItem text="Create a server" page={page} number={1} />
      <SubMenuItem text="Install KeyVault" page={page} number={2} />
      <SubMenuItem text="KeyVault created" page={page} number={3} />
      <Separator />
      <MenuItem text="Create a Validator" number={2} step={step} />
      <SubMenuItem text="Select Staking Network" page={page} number={4} />
      <SubMenuItem text="Generate Keys" page={page} number={5} />
      <SubMenuItem text="Keys Created" page={page} number={6} />
      <SubMenuItem text="Staking Deposit" page={page} number={7} />
      <SubMenuItem text="Wait for Approval" page={page} number={8} />
    </Wrapper>
  );
};

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
};

export default Navigation;
