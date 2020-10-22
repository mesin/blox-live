import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { notification } from 'antd';

import { CustomModal, Tooltip, InfoWithTooltip } from 'common/components';
import { openExternalLink } from '../common/service';

import { CopyToClipboardIcon, Link } from '../Wizard/components/common';
import { generateDepositDataInfo } from '../Wizard/components/Validators/service';
import * as wizardActions from '../Wizard/actions';
import { getDepositData, getNetwork } from '../Wizard/selectors';

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
  margin-top:80px;
  color: ${({ theme }) => theme.primary900};
  cursor:pointer;
  &:hover {
    color: ${({ theme }) => theme.primary600};
  }
`;

const onCopy = () => notification.success({message: 'Copied to clipboard!'});

const DepositInfoModal = ({onClose, depositData, network, actions}: Props) => {
  const { clearDepositData } = actions;

  const depositDataInfo = generateDepositDataInfo(network, depositData);

  const onCloseClick = () => {
    clearDepositData();
    onClose();
  };

  return (
    <CustomModal width={'700px'} height={'462px'} onClose={onClose}>
      <InnerWrapper>
        <Title>Deposit Info</Title>
        {depositData && depositDataInfo.map((row, index) => {
          const { label, title, moreInfo, value } = row;
          const isTxData = label === depositDataInfo[1].label;
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
              <CopyToClipboardIcon text={valueText} onCopy={onCopy} />
            </Row>
          );
        })}
        <Row>
          <Link onClick={() => openExternalLink('docs-guides/#pp-toc__heading-anchor-15')}>
            Need help?
          </Link>
        </Row>
        <CloseButton onClick={onCloseClick}>Close</CloseButton>
      </InnerWrapper>
    </CustomModal>
  );
};

type Props = {
  depositData: string;
  network: string;
  onClose: () => void;
  actions: Record<string, any>;
};

const mapStateToProps = (state) => ({
  depositData: getDepositData(state),
  network: getNetwork(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(wizardActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(DepositInfoModal);
