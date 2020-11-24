import React from 'react';
import styled from 'styled-components';

import { generateDepositDataInfo } from '../../service';

import { InfoWithTooltip, Tooltip } from 'common/components';
import { CopyToClipboardIcon } from '../../../common';
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
  const depositDataInfo = depositData && generateDepositDataInfo(depositData);
  return (
    <Wrapper>
      {depositDataInfo.map((row, index) => {
        const { label, title, moreInfo, value } = row;
        const isTxData = label === depositDataInfo[1].label;
        const isAmount = label === depositDataInfo[2].label;
        const valueText = isTxData ? depositDataInfo[1].value : value;
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
            {!isAmount && <CopyToClipboardIcon text={valueText} onCopy={onCopy} />}
          </Row>
        );
      })}
    </Wrapper>
  );
};

type Props = {
  depositData: Record<string, any>;
  onCopy: () => void;
  network: string;
};

export default DepositData;
