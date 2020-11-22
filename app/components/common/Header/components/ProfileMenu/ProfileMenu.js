import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from './Button';
import MenuButton from './MenuButton';
import Connection from 'backend/common/store-manager/connection';
import { openLocalDirectory } from 'common/service';

const Wrapper = styled.div`
  position: relative;
  margin-left: 15px;
`;

const Menu = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #ffffff;
  position: absolute;
  top: 32px;
  right: 0px;
  box-shadow: 0px 2px 4px 0px ${({ theme }) => theme.gray80015};
  border-radius: 4px;
`;

const Image = styled.img`
  width: 26px;
  height: 26;
  border-radius: 50%;
`;

const MenuItem = styled.div`
  width: 100%;
  padding: 12px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
`;

const Name = styled.span`
  color: ${({ theme }) => theme.gray800};
  padding: 4px 16px;
`;

const Email = styled.span`
  color: ${({ theme }) => theme.gray400};
  padding: 4px 16px;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.gray300};
`;

const ProfileMenu = forwardRef(
  ({ isOpen, toggleOpen, profile, logout }, ref) => {
    const canViewTestPage = () => {
      return Connection.db().exists('testPage');
    };

    const openLogsFolder = () => {
      openLocalDirectory('logs');
      toggleOpen(false);
    };

    const { email, name, picture } = profile;
    return (
      <Wrapper ref={ref}>
        <Button isOpen={isOpen} onClick={() => toggleOpen(!isOpen)}>
          <Image src={picture} />
        </Button>
        {isOpen && (
          <Menu>
            <MenuItem>
              <Name>{name}</Name>
              <Email>{email}</Email>
            </MenuItem>
            <Separator />
            {canViewTestPage() && (
              <MenuItem>
                <Link to={'/test'} style={{marginLeft: '16px'}}>Test page</Link>
              </MenuItem>
            )}
            <MenuItem>
              <MenuButton onClick={openLogsFolder}>Open logs folder</MenuButton>
            </MenuItem>
            <MenuItem>
              <MenuButton onClick={logout}>Log Out</MenuButton>
            </MenuItem>
          </Menu>
        )}
      </Wrapper>
    );
  },
);

ProfileMenu.propTypes = {
  isOpen: PropTypes.bool,
  toggleOpen: PropTypes.func,
  profile: PropTypes.object,
  logout: PropTypes.func,
};

export default ProfileMenu;
