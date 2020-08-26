import React from 'react';
import styled from 'styled-components';
import { notification } from 'antd';
import { CustomModal, InfoWithTooltip } from 'common/components';
import { CopyToClipboardIcon, Link } from '../Wizard/components/common';

const InnerWrapper = styled.div`
  width:100%;
  height:100%;
  padding:42px 86px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 900;
  line-height: 1.69;
  margin: 24px 0px;
`;

const Row = styled.div`
  max-width:100%;
  display:flex;
  text-align:left;
  margin-bottom:25px;
`;

const Key = styled.span`
  font-size: 16px;
  font-weight: 900;
`;

const Value = styled.span`
  font-size: 14px;
  font-weight: 500;
  margin-right:7px;
  max-width:400px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
`;

const CloseButton = styled.div`
  margin-top:80px;
  color: ${({ theme }) => theme.primary900};
  cursor:pointer;
  &:hover {
    color: ${({ theme }) => theme.primary600};
  }
`;

const moreInfoTexts = {
  to: 'This where your deposit transactions should be sent in order to run your validator and start staking.',
  txData: 'TX data holds additional information that is required for the transaction.',
  amount: 'The transaction amount refers to the amount of Ethereum required for staking. Please send the exact amount.',
};

const depositTo = '0x07b39f4fde4a38bace212b546dac87c58dfe3fdc';
const amount = '32 GoETH';

const onCopy = () => notification.success({message: 'Copied to clipboard!'});

const DepositInfoModal = ({onClose, depositData}: Props) => {
  return (
    <CustomModal width={'700px'} height={'462px'} onClose={onClose}>
      <InnerWrapper>
        <Title>Deposit Info</Title>
        <Row>
          <Key>
            To Address
            <InfoWithTooltip title={moreInfoTexts.to} placement="right" />
          </Key>
          <Value>{depositTo}</Value>
          <CopyToClipboardIcon text={depositTo} onCopy={onCopy} />
        </Row>
        <Row>
          <Key>
            Tx Data:
            <InfoWithTooltip title={moreInfoTexts.txData} placement="right" />
          </Key>
          <Value>{depositData}</Value>
          <CopyToClipboardIcon text={depositData} onCopy={onCopy} />
        </Row>
        <Row>
          <Key>
            Amount:
            <InfoWithTooltip title={moreInfoTexts.amount} placement="right" />
          </Key>
          <Value>{amount}</Value>
          <CopyToClipboardIcon text={amount} onCopy={onCopy} />
        </Row>
        <Row>
          <Link href={'https://www.bloxstaking.com/blox-guide-how-do-i-submit-my-staking-deposit'}>
            Need help?
          </Link>
        </Row>
        <CloseButton onClick={onClose}>Close</CloseButton>
      </InnerWrapper>
    </CustomModal>
  );
};

type Props = {
  depositData: string;
  onClose: () => void;
};

export default DepositInfoModal;
