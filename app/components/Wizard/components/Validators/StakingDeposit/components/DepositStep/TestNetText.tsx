import React from 'react';
import styled from 'styled-components';
import theme from "../../../../../../../theme";
import {openExternalLink} from "../../../../../../common/service";
import {Link} from "../../../../common/index";
import DepositStepData from "./DepositStepData";
import DepositText from "./DepositText";

const TextInfo = styled.span`
    font-size: 12px;
    font-weight: 900;
    color: ${({theme, color}) => theme[color] || theme.gray600};
`;

const DEPOSIT_TOOLTIP = 'Blox has no access to your 32 ETHs as they are to be deposited to the Ethereum 2.0 Blockchain deposit smart contract. Withdrawal of if the ETHs is currently not enabled and should be available when ETH 2.0 reaches Phase 1';

const TestNetText = (props: Props) => {
  const {publicKey, onCopy} = props;

  return (
    <div>
      <DepositStepData step={1} title={'Validator yearly service fee'} tag={'Free'} hint={true} amount={0} token={'ETH'}>
        <TextInfo>
          <TextInfo color={'gray800'}>Testnet validators are FREE. </TextInfo>
        </TextInfo>
      </DepositStepData>
      <DepositStepData step={2} title={'Validator deposit'} amount={32} token={'GoETH'} tooltip={DEPOSIT_TOOLTIP}>
        <DepositText publicKey={publicKey} token={'Goerli'} onCopy={onCopy}/>
      </DepositStepData>
    </div>


  );
};

type Props = {
  publicKey: string;
  onCopy: () => void;
};

export default TestNetText;
