import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { ClickAwayListener } from '@material-ui/core';
import HeaderLink from './HeaderLink';
import { FaqMenu, ProfileMenu } from './components';

import { logout } from '../../CallbackPage/actions';
import { getUserData } from '../../CallbackPage/selectors';

import { getWizardFinishedStatus, getWalletStatus } from '../../Wizard/selectors';

import * as actionsFromDashboard from '../../Dashboard/actions';
import { MODAL_TYPES } from '../../Dashboard/constants';

import imageSrc from 'assets/images/staking-logo.svg';

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

const AddValidatorButton = styled.button`
  width:136px;
  height:32px;
  background-color:${({theme}) => theme.primary700};
  color:${({theme}) => theme.gray50};
  margin-right:20px;
  border:0px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size: 14px;
  font-weight: 900;
  border-radius:6px;
  cursor:pointer;
  &:hover {
    color:${({theme}) => theme.accent2200};
  }
`;

const Header = (props: Props) => {
  const { withMenu, profile, logoutUser, isFinishedWizard, walletStatus, location, dashboardActions } = props;
  const { setModalDisplay } = dashboardActions;
  const [isFaqMenuOpen, toggleFaqMenuOpenDisplay] = useState(false);
  const [isProfileMenuOpen, toggleProfileMenuOpenDisplay] = useState(false);
  const [showOrangeDot, toggleOrangeDotDisplay] = useState(true);
  const isInDashboardPage = location.pathname === '/' && isFinishedWizard;
  const hideTopNav = true;

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

  const onAddValidatorClick = () => {
    if (walletStatus === 'active') {
      setModalDisplay({show: true, type: MODAL_TYPES.ADD_VALIDATOR, text: ''});
      return;
    }
    const text = 'Your KeyVault is inactive. Please reactivate your KeyVault before creating a new validator.';
    setModalDisplay({show: true, type: MODAL_TYPES.REACTIVATION, text});
  };

  return (
    <Wrapper>
      <Left> <Logo src={imageSrc} /> </Left>
      {withMenu && !hideTopNav && (
        <Center>
          <HeaderLink to="/" name="Dashboard" iconName="graph" />
          <HeaderLink to="/settings/general" name="Settings" iconName="settings" />
        </Center>
      )}
      <Right>
        {isInDashboardPage && (
          <AddValidatorButton onClick={() => onAddValidatorClick()}>Add Validator</AddValidatorButton>
        )}
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
              logout={logoutUser}
            />
          </ClickAwayListener>
        )}
      </Right>
    </Wrapper>
  );
};

interface Props extends RouteComponentProps {
  withMenu: boolean;
  profile: Record<string, any>;
  logoutUser: () => void;
  isFinishedWizard: boolean;
  walletStatus: string;
  dashboardActions: Record<string, any>;
}

const mapStateToProps = (state) => ({
  profile: getUserData(state),
  isFinishedWizard: getWizardFinishedStatus(state),
  walletStatus: getWalletStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => dispatch(logout()),
  dashboardActions: bindActionCreators(actionsFromDashboard, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
