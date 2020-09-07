import React from 'react';
import styled from 'styled-components';
import { InfoWithTooltip, Tooltip } from 'common/components';
import { CopyToClipboardIcon } from '../../../common';
import { DEPOSIT_DATA } from '../constants';
import { truncateText } from '../../../../../common/service';

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
  overflow:hidden;
  white-space:nowrap;
  font-size: 13px;
  font-weight: 500;
  color: ${({theme}) => theme.gray800};
  margin-right:8px;
`;

const DepositData = (props: Props) => {
  const { depositData, onCopy } = props;
  return (
    <Wrapper>
      {DEPOSIT_DATA.map((row, index) => {
        const { label, title, moreInfo, value } = row;
        const isTxData = label === DEPOSIT_DATA[1].label;
        const valueText = isTxData ? depositData : value;
        return (
          <Row key={index}>
            <KeyText>
              {title}:
              <InfoWithTooltip title={moreInfo} placement="right" />
            </KeyText>
            {isTxData ? (
              <Tooltip placement={'bottom'} title={valueText}>
                <ValueText>{truncateText(valueText, 36, 6)}</ValueText>
              </Tooltip>
            ) : (
              <ValueText>{valueText}</ValueText>
            )}
            <CopyToClipboardIcon text={valueText} onCopy={onCopy} />
          </Row>
        );
      })}
    </Wrapper>
  );
};

type Props = {
  depositData: string;
  onCopy: () => void;
};

export default DepositData;
