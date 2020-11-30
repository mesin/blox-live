import React from 'react';
import styled from 'styled-components';
import { shell } from 'electron';
import { InfoWithTooltip } from 'common/components';
import { Paragraph } from '../../../common';
import { INTRO_TOOLTIP_TEXT } from '../../constants';
import config from 'backend/common/config';

const GoEthButton = styled.a`
  width:113px;
  height:28px;
  border-radius:6px;
  border:solid 1px ${({theme}) => theme.gray400};
  font-size: 11px;
  font-weight: 500;
  color:${({theme}) => theme.primary900};
  display:flex;
  align-items:center;
  justify-content:center;
  margin-top:12px;
  cursor:pointer;
`;

const TestNetText = () => {
  return (
    <Paragraph>
      To start staking on the beacon chain Testnet, you are required to deposit <br />
      32 GoETH<InfoWithTooltip title={INTRO_TOOLTIP_TEXT} placement="bottom" /> into the
      validator deposit contract.
      <GoEthButton onClick={() => shell.openExternal(config.env.DISCORD_GOETH_INVITE)}>
        Need GoETH?
      </GoEthButton>
    </Paragraph>
  );
};

export default TestNetText;
