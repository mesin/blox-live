import React from 'react';
import styled from 'styled-components';
import { InfoWithTooltip } from 'common/components';
import { openExternalLink } from 'components/common/service';
import { Title, Paragraph, BigButton, Checkbox, Link } from '../../common';

const Wrapper = styled.div`
  width:580px;
`;

const Terms = styled.div`
  font-size:12px;
  display:flex;
  align-items:center;
  margin-bottom:17px;
`;

const CheckBoxWrapper = styled.div`
  margin-right:9px;
`;

const GreenColor = styled.span`
  color:${({theme}) => theme.accent2400};
`;

const TOOLTIP_TEXT = `Blox Staking service charges will only be applied to validators
                      created after this promotion ends. Don't worry, we will NEVER
                      charge you for creating or running the validators created during
                      this promotion period.`;

const EarlyAdopters = ({onClick}: Props) => {
  const [checked, setCheckedStatus] = React.useState(false);
  const onButtonClick = () => checked && onClick();

  return (
    <Wrapper>
      <Title color={'accent2400'}>Blox is FREE! for Early Adopters</Title>
      <Paragraph>
        In order to give Eth 2.0 an early stage power push, we decided to offer free service for all stakers.
      </Paragraph>
      <Paragraph>
        We will NOT charge you on any validators created during the &quot;early <br />
        stage&quot; period. Once we start to charge our users, you will be notified (no surprise fees)
        <InfoWithTooltip title={TOOLTIP_TEXT} placement="bottom" />
      </Paragraph>
      <Paragraph>
        <GreenColor>Validators created during the promotion are FREE.</GreenColor>
      </Paragraph>
      <Paragraph>
        Sounds good?
      </Paragraph>
      <Terms>
        <CheckBoxWrapper>
          <Checkbox checked={checked} onClick={setCheckedStatus} />
        </CheckBoxWrapper>
        I agree to Blox&apos;s&nbsp;
        <Link onClick={() => openExternalLink('privacy-policy')}>Privacy policy</Link> &nbsp;&amp;&nbsp;
        <Link onClick={() => openExternalLink('terms-of-use')}>License and Service Agreement</Link>
      </Terms>

      <BigButton isDisabled={!checked} onClick={onButtonClick}>Continue to Staking Deposit</BigButton>
    </Wrapper>
  );
};

type Props = {
  onClick: () => void;
};

export default EarlyAdopters;
