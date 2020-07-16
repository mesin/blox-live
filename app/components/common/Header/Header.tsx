import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ClickAwayListener } from '@material-ui/core';
import HeaderLink from './HeaderLink';
import { FaqMenu, ProfileMenu } from './components';

import Auth from '../../Auth';

const logo = require('../../../assets/images/staking-logo.svg');

const auth = new Auth();

const Wrapper = styled.div`
  width: 100%;
  height: 70px;
  padding: 0px 7.5vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.primary900};
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0px;
  z-index: 10;
`;

const Left = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Center = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  width: 77px;
  height: 37px;
  margin-right: 65px;
`;

const Right = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Header = (props: Props) => {
  const { withMenu } = props;
  const [isFaqMenuOpen, toggleFaqMenuOpenDisplay] = useState(false);
  const [isProfileMenuOpen, toggleProfileMenuOpenDisplay] = useState(false);
  const [showOrangeDot, toggleOrangeDotDisplay] = useState(true);
  const [profile, setProfile] = useState(null);

  const onFaqMenuClick = (isOpen) => {
    toggleFaqMenuOpenDisplay(isOpen);
    if (isOpen === false) {
      toggleOrangeDotDisplay(false);
    }
  };

  const handleFaqClickAway = () => {
    toggleFaqMenuOpenDisplay(false);
  };

  const handleProfileClickAway = () => {
    toggleProfileMenuOpenDisplay(false);
  };

  const onLoadProfileSuccess = (results, error) => {
    if (error) {
      return;
    }
    setProfile(results);
  };

  useEffect(() => {
    const getProfile = async () => {
      await auth.getProfile((results, error) =>
        onLoadProfileSuccess(results, error)
      );
    };
    getProfile();
  });
  return (
    <Wrapper>
      <Left>
        <a href="/">
          <Logo src={logo} />
        </a>
      </Left>
      {withMenu && (
        <Center>
          <HeaderLink to="/" name="Dashboard" iconName="graph" />
          <HeaderLink
            to="/settings/general"
            name="Settings"
            iconName="settings"
          />
        </Center>
      )}
      <Right>
        <ClickAwayListener onClickAway={handleFaqClickAway}>
          <FaqMenu
            isOpen={isFaqMenuOpen}
            onClick={onFaqMenuClick}
            showOrangeDot={showOrangeDot}
          />
        </ClickAwayListener>
        {profile && (
          <ClickAwayListener onClickAway={handleProfileClickAway}>
            <ProfileMenu
              profile={profile}
              isOpen={isProfileMenuOpen}
              toggleOpen={toggleProfileMenuOpenDisplay}
              auth={auth}
            />
          </ClickAwayListener>
        )}
      </Right>
    </Wrapper>
  );
};

type Props = {
  withMenu: boolean;
};

export default Header;
