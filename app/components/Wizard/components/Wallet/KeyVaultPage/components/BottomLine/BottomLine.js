import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../../../../../../common/components';
import { Connection } from '../../../../common';

const Wrapper = styled.div`
  width: 566px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary900};
  font-size: 12px;
  padding: 12px 0px;
`;

const InnerWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HelpLink = styled.a`
  font-weight: 500;
  color: ${({ theme }) => theme.primary900};
  margin-right: 22px;
`;

const Warning = styled.div`
  width: 100%;
  padding: 20px 16px;
  margin-top: 37px;
  color: ${({ theme }) => theme.warning900};
  border: 2px solid ${({ theme }) => theme.warning900};
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
`;

const IconWrapper = styled.div`
  margin-right: 12px;
`;

const Text = styled.div``;

const BottomLine = () => (
  <Wrapper>
    <InnerWrapper>
      <Connection text="Establishing a connection to your server" />
      <HelpLink href="/" target="_blank">
        Having problems?
      </HelpLink>
    </InnerWrapper>
    <InnerWrapper>
      <Warning>
        <IconWrapper>
          <Icon name="report" fontSize="22px" color="warning900" />
        </IconWrapper>
        <Text>
          Please safeguard your 24-phrase backup seed somewhere secure. <br />
          This is the only method of restoring wallet access.
        </Text>
      </Warning>
    </InnerWrapper>
  </Wrapper>
);

export default BottomLine;
