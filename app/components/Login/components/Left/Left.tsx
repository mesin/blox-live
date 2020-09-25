import React from 'react';
import styled from 'styled-components';
import logo from 'assets/images/staking-logo.svg';

const Wrapper = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const Logo = styled.img`
  margin-bottom: 24px;
`;

const Intro = styled.div`
  width: 565px;
  height: 76px;
  font-size: 54px;
  line-height: 79px;
  color: #f7fcff;
`;

const Left = () => (
  <Wrapper>
    <InnerWrapper>
      <Logo src={logo} />
      <Intro>
        Start Staking with Blox
      </Intro>
    </InnerWrapper>
  </Wrapper>
);

export default Left;
