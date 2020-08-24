import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.a``;

const Button = styled.div``;

const Icon = styled.i``;

const Expanded = styled.div``;

const TalkToUsIcon = styled.i``;

const DiscordButton = () => { // work in progress
  return (
    <Wrapper href="#discord_link_here" target="_blank">
      <Button class="btn btn-dark floating-btn">
        <Icon class="icon fab fa-discord"></Icon>
        <Expanded class="expanded">
          <span>
            <TalkToUsIcon class="far fa-comments"></TalkToUsIcon> Talk to us on Discord
          </span>
        </Expanded>
      </Button>
    </Wrapper>
  );
};

export default DiscordButton;
