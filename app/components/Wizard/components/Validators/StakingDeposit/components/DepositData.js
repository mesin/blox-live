import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { notification } from 'antd';
import { InfoWithTooltip } from 'common/components';
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
  font-size: 13px;
  font-weight: 500;
  color: ${({theme}) => theme.gray400};
  margin-right:8px;
`;

const moreInfoTexts = {
  to: 'This where your deposit transactions should be sent in order to run your validator and start staking.',
  txData: 'TX data holds additional information that is required for the transaction.',
  amount: 'The transaction amount refers to the amount of Ethereum required for staking. Please send the exact amount.',
  gasPrice: 'Gas refers to the fee, or pricing value, required to successfully conduct a transaction or execute a contract on the Ethereum blockchain platform.',
  gasLimit: 'The term gas limit refers to the maximum price a cryptocurrency user is willing to pay when sending a transaction, or performing a smart contract function, in the Ethereum blockchain.',
};

const DepositData = (props) => { // TODO: check if depositDataRoot is the tx data
  const { depositData } = props;
  const { depositDataRoot } = depositData;

  const onCopy = () => notification.success({message: 'Copied to clipboard!'});

  return (
    <Wrapper>
      <Row>
        <KeyText>
          To Address:
          <InfoWithTooltip title={moreInfoTexts.to} placement="right" />
        </KeyText>
        <ValueText>0x0F0F0fc0530007361933EaB5DB97d09aCDD6C1c8</ValueText>
        <CopyToClipboardIcon text={'0x0F0F0fc0530007361933EaB5DB97d09aCDD6C1c8'} onCopy={onCopy} />
      </Row>
      <Row>
        <KeyText>
          Tx Data:
          <InfoWithTooltip title={moreInfoTexts.txData} placement="right" />
        </KeyText>
        <ValueText>{depositDataRoot}</ValueText>
        <CopyToClipboardIcon text={depositDataRoot} onCopy={onCopy} />
      </Row>
      <Row>
        <KeyText>
          Amount:
          <InfoWithTooltip title={moreInfoTexts.amount} placement="right" />
        </KeyText>
        <ValueText>32 GoETH</ValueText>
        <CopyToClipboardIcon text={'32 GoETH'} onCopy={onCopy} />
      </Row>
      <Row>
        <KeyText>
          Gas Price:
          <InfoWithTooltip title={moreInfoTexts.gasPrice} placement="right" />
        </KeyText>
        <ValueText>0.223444</ValueText>
        <CopyToClipboardIcon text={'0.223444'} onCopy={onCopy} />
      </Row>
      <Row>
        <KeyText>
          Gas Limit:
          <InfoWithTooltip title={moreInfoTexts.gasLimit} placement="right" />
        </KeyText>
        <ValueText>0.223444</ValueText>
        <CopyToClipboardIcon text={'0.223444'} onCopy={onCopy} />
      </Row>
    </Wrapper>
  );
};

DepositData.propTypes = {
  depositData: PropTypes.object,
};

export default DepositData;
