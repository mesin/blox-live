import React from 'react';
import styled from 'styled-components';
import { Icon } from '../../../../../../common/components';
import Title from '../../../Title';
import SubTitle from '../../../SubTitle';
import Separator from '../../../Separator';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubTitleText = styled.span`
  margin-right: 10px;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 36px;
`;

const ContentBox = styled.div`
  width: 50%;
`;

const Text = styled.div`
  color: ${({ theme }) => theme.gray800};
  font-size: 14px;
  font-weight: 500;
`;

const SmallText = styled.div`
  color: ${({ theme }) => theme.gray800};
  font-size: 11px;
  font-weight: 500;
`;

const EmailsList = styled.div`
  display: flex;
`;

const AddMoreEmailsButton = styled.div`
  color: ${({ theme }) => theme.primary600};
  cursor: pointer;
`;

const Regular = () => (
  <Wrapper>
    <Content>
      <ContentBox>
        <SubTitle>Current Plan</SubTitle>
        <Text>Monthly</Text>
        <SmallText>19$ per validator</SmallText>
      </ContentBox>
      <ContentBox>
        <SubTitle>Next Billing</SubTitle>
        <Text>May 3, 2020</Text>
      </ContentBox>
    </Content>
    <Separator />
    <Title>Payment Information</Title>
    <Content>
      <ContentBox>
        <SubTitle>
          <SubTitleText>Payment Method</SubTitleText>
          <Icon
            name="edit"
            fontSize="14px"
            color="primary900"
            onClick={() => console.log('edit')}
          />
        </SubTitle>
        <Text>**** **** **** 3133</Text>
        <SmallText>Expires 5/25</SmallText>
      </ContentBox>
      <ContentBox>
        <SubTitle>
          <SubTitleText>Billing Details</SubTitleText>
          <Icon
            name="edit"
            fontSize="14px"
            color="primary900"
            onClick={() => console.log('edit')}
          />
        </SubTitle>
        <Text>
          P&amp;G Ltd <br />
          Howard@png.com <br /> <br />
          Procter &amp; Gamble Plaza Cincinnati, OH <br />
          45201 USA
        </Text>
      </ContentBox>
    </Content>
    <Separator />
    <Title>Billing History</Title>
    <SubTitle>Send Reciepts To</SubTitle>
    <EmailsList>
      Howard@png.com, JonnyTailor@png.com &nbsp;
      <AddMoreEmailsButton>Add more recipents</AddMoreEmailsButton>
    </EmailsList>
  </Wrapper>
);

export default Regular;
