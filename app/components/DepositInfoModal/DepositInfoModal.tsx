import React from 'react';
import styled from 'styled-components';
import { notification } from 'antd';
import { CustomModal, Tooltip, InfoWithTooltip } from 'common/components';
import { CopyToClipboardIcon } from '../Wizard/components/common';
import { DEPOSIT_DATA } from '../Wizard/components/Validators/StakingDeposit/constants';

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
  align-items:center;
  text-align:left;
  margin-bottom:25px;
`;

const KeyText = styled.span`
  font-size: 16px;
  font-weight: 900;
`;

const ValueText = styled.span`
  font-size: 14px;
  font-weight: 500;
  margin-right:7px;
  max-width:350px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
`;

const CloseButton = styled.div`
  margin-top:110px;
  color: ${({ theme }) => theme.primary900};
  cursor:pointer;
  &:hover {
    color: ${({ theme }) => theme.primary600};
  }
`;

const onCopy = () => notification.success({message: 'Copied to clipboard!'});

const DepositInfoModal = ({onClose, depositData}: Props) => {
  return (
    <CustomModal width={'700px'} height={'462px'} onClose={onClose}>
      <InnerWrapper>
        <Title>Deposit Info</Title>
        {DEPOSIT_DATA.map((row, index) => {
          const { label, title, moreInfo, value } = row;
          const isTxData = label === DEPOSIT_DATA[1].label;
          const isAmount = label === DEPOSIT_DATA[2].label;
          const valueText = isTxData ? depositData : value;
          return (
            <Row key={index}>
              <KeyText>
                {title}:
                <InfoWithTooltip title={moreInfo} placement="right" />
              </KeyText>
              {isTxData ? (
                <Tooltip placement={'bottom'} title={valueText}>
                  <ValueText>{valueText}</ValueText>
                </Tooltip>
              ) : (
                <ValueText>{valueText}</ValueText>
              )}
              {!isAmount && <CopyToClipboardIcon text={valueText} onCopy={onCopy} />}
            </Row>
          );
        })}
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
