import React from 'react';
import styled from 'styled-components';
import { InfoWithTooltip } from 'common/components';
import { Title, Paragraph, BigButton, Checkbox } from '../../common';

const Wrapper = styled.div`
  width:580px;
`;

const ButtonsWrapper = styled.div`
  width:100%;
  margin-top:36px;
  display:flex;
  justify-content:space-between;
`;

const TOOLTIP_TEXT = `Blox Staking service charges will only be applied to validators
                      created after this promotion ends. Don't worry, we will NEVER
                      charge you for creating or running the validators created during
                      this promotion period.`;

const EarlyAdopters = (props: Props) => {
  return (
    <Wrapper>
      <Title>Blox is FREE! for Early Adopters</Title>
      <Paragraph>
        In order to give Eth 2.0 an early stage power push, we decided to offer free service for all stakers.
      </Paragraph>
      <Paragraph>
        We will NOT charge you on any validators created during the “early stage” period.
        Once we start to charge our users, you will be notified (no surprise fees)
        <InfoWithTooltip title={TOOLTIP_TEXT} placement="bottom" />
      </Paragraph>
      <Paragraph>
        Validators created during the promotion are FREE.
      </Paragraph>
      <Paragraph>
        Sounds good?
      </Paragraph>
      <Checkbox checked={true} />
      <BigButton>Continue to Staking Deposit</BigButton>
    </Wrapper>
  );
};

type Props = {

};

export default EarlyAdopters;
