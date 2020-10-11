import React from 'react';
import styled from 'styled-components';
import { Icon } from 'common/components';
import { shell } from 'electron';
import config from 'backend/common/config';

const Wrapper = styled.div`
  width:50px;
  height:50px;
  color: white;
  background: #7289da;
  border-color: #7289da;
  position: fixed;
  bottom: 10px;
  left: 10px;
  z-index:60;
  font-size: 2.6rem;
  border-radius: 5.2rem 5.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: width 0.5s ease;
  white-space: nowrap;
  overflow:hidden;
  cursor:pointer;
  &:hover {
    width: 174px;
    & > .icon-discord-symbol {
      opacity: 0;
    }
    & > .expanded {
      opacity: 1;
    }
  }
`;

const Expanded = styled.div`
  opacity: 0;
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  font-size: 24px;
  transition: opacity 0.25s ease;
`;

const ReachUsText = styled.span`
  font-size: 14px;
  font-weight: 900;
  color:${({theme}) => theme.gray50};
`;

const DiscordButton = () => {
  return (
    <Wrapper className="btn btn-dark floating-btn" onClick={() => shell.openExternal(config.env.DISCORD_INVITE)}>
      <Icon color={'gray50'} name={'discord-symbol'} fontSize={'24px'} />
      <Expanded className="expanded">
        <ReachUsText>Reach us on DISCORD</ReachUsText>
      </Expanded>
    </Wrapper>
  );
};

export default DiscordButton;
