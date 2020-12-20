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

const FEE_TOOLTIP = 'Blox Staking service charges will only be applied to validators created after this promotion ends. Don\'t worry, we will NEVER charge you for creating or running the validators created during this promotion period.';
const DEPOSIT_TOOLTIP = 'Blox has no access to your 32 ETHs as they are to be deposited to the Ethereum 2.0 Blockchain deposit smart contract. Withdrawal of if the ETHs is currently not enabled and should be available when ETH 2.0 reaches Phase 1';

const MainNetText = (props: Props) => {
  const {publicKey, onCopy} = props;
  return (
    <div>
      <DepositStepData step={1} title={'Yearly fee - Free for a limited time'} tooltip={FEE_TOOLTIP} tag={'Yes, It\'s Free'} hint={true} amount={0.5} token={'ETH'}>
        <TextInfo>
          <TextInfo>We will NOT charge you on validators created during the "early stage" period. Once we start to charge, you will be notified.</TextInfo>
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
