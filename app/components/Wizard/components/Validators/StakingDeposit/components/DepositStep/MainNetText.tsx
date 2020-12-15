import React from 'react';
import {Link} from '../../../../common/index';
import DepositStepData from "./DepositStepData";
import theme from "../../../../../../../theme";
import {openExternalLink} from "../../../../../../common/service";
import styled from "styled-components";
import DepositText from "./DepositText";

const TextInfo = styled.span`
    font-size: 12px;
    font-weight: 900;
    color: ${({theme, color}) => theme[color] || theme.gray600};
`;

const FEE_TOOLTIP = 'By depositing the service fee, Blox will provide you with a full year of staking services for your Eth2 validator. The fee will not renew automatically and you will be asked to deposit a new fee the following year. 1 service fee of 0.5 ETH provides services for 1 validator for 1 year. The service fee is non refundable. Network gas fees will apply.';
const DEPOSIT_TOOLTIP = 'Blox has no access to your 32 ETHs as they are to be deposited to the Ethereum 2.0 Blockchain deposit smart contract. Withdrawal of if the ETHs is currently not enabled and should be available when ETH 2.0 reaches Phase 1';

const MainNetText = (props: Props) => {
  const {publicKey, onCopy} = props;
  return (
    <div>
      <DepositStepData step={1} title={'Validator yearly service fee'} tooltip={FEE_TOOLTIP} amount={0.5} token={'ETH'}>
        <TextInfo>
          <TextInfo>Run 1 validator until transfers are enabled (phase 1.5) OR up to 2 years. Whichever comes first. Fee is converted into CDT and </TextInfo>
          <Link style={{color: theme['primary600']}} onClick={() => openExternalLink('https://www.bloxstaking.com')}>burnt.</Link>
        </TextInfo>
      </DepositStepData>
      <DepositStepData step={2} title={'Validator deposit'} amount={32} token={'ETH'} tooltip={DEPOSIT_TOOLTIP}>
        <DepositText publicKey={publicKey} token={'ETH'} onCopy={onCopy}/>
      </DepositStepData>
    </div>
  );
};

type Props = {
  publicKey: string;
  onCopy: () => void;
};

export default MainNetText;
