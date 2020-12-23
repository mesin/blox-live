import React from 'react';
import styled from 'styled-components';
import DepositStepData from './DepositStepData';
import DepositText from './DepositText';

const TextInfo = styled.span`
    font-size: 12px;
    font-weight: 900;
    color: ${({theme, color}) => theme[color] || theme.gray600};
`;

const DEPOSIT_TOOLTIP = 'Blox has no access to your 32 ETH as the funds are deposited directly onto the official Eth2 deposit contract. ETH withdrawals are currently not supported but are scheduled to be enabled in later phases as Eth2 matures.';

const TestNetText = (props: Props) => {
  const {publicKey, onCopy} = props;

  return (
    <div>
      <DepositStepData step={1} title={'Validator yearly service fee'} tag={'Free'} hint amount={0} token={'ETH'}>
        <TextInfo>
          <TextInfo color={'gray800'}>Testnet validators are FREE. </TextInfo>
        </TextInfo>
      </DepositStepData>
      <DepositStepData step={2} title={'Validator deposit'} amount={32} token={'GoETH'} tooltip={DEPOSIT_TOOLTIP}>
        <DepositText publicKey={publicKey} token={'Goerli'} onCopy={onCopy} />
      </DepositStepData>
    </div>

  );
};

type Props = {
  publicKey: string;
  onCopy: () => void;
};

export default TestNetText;
