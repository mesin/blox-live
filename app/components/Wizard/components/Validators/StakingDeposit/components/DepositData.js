import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { notification } from 'antd';
import { InfoWithTooltip, Tooltip } from 'common/components';
import { CopyToClipboardIcon } from '../../../common';

const Wrapper = styled.div`
  width:100%;
  display:flex;
  flex-direction:column;
`;

const Row = styled.div`
  width:100%;
  display:flex;
  flex-direction:row;
  align-items:center;
  padding-bottom:16px;
  position:relative;
`;

const KeyText = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: ${({theme}) => theme.gray800};
`;

const ValueText = styled.div`
  max-width:300px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  font-size: 13px;
  font-weight: 500;
  color: ${({theme}) => theme.gray400};
  margin-right:8px;
`;

const moreInfoTexts = {
  to: 'This where your deposit transactions should be sent in order to run your validator and start staking.',
  txData: 'TX data holds additional information that is required for the transaction.',
  amount: 'The transaction amount refers to the amount of Ethereum required for staking. Please send the exact amount.',
};

const depositTo = '0x07b39f4fde4a38bace212b546dac87c58dfe3fdc';
const amount = '32 GoETH';

const DepositData = (props) => {
  const { depositData } = props;

  const onCopy = () => notification.success({message: 'Copied to clipboard!'});

  return (
    <Wrapper>
      <Row>
        <KeyText>
          To Address:
          <InfoWithTooltip title={moreInfoTexts.to} placement="right" />
        </KeyText>
        <ValueText>{depositTo}</ValueText>
        <CopyToClipboardIcon text={depositTo} onCopy={onCopy} />
      </Row>
      <Row>
        <KeyText>
          Tx Data:
          <InfoWithTooltip title={moreInfoTexts.txData} placement="right" />
        </KeyText>
        <Tooltip placement={'bottom'} title={depositData}>
          <ValueText>{depositData}</ValueText>
        </Tooltip>
        <CopyToClipboardIcon text={depositData} onCopy={onCopy} />
      </Row>
      <Row>
        <KeyText>
          Amount:
          <InfoWithTooltip title={moreInfoTexts.amount} placement="right" />
        </KeyText>
        <ValueText>{amount}</ValueText>
        <CopyToClipboardIcon text={amount} onCopy={onCopy} />
      </Row>
    </Wrapper>
  );
};

DepositData.propTypes = {
  depositData: PropTypes.object,
};

export default DepositData;
