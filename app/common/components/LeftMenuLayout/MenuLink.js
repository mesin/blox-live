import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LinkWrapper = styled.div`
  margin-bottom: 35px;
  a {
    color: ${({ theme, isActive }) =>
      isActive ? theme.primary900 : theme.gray600};
    text-decoration: none;
    font-size: 16px;
    font-weight: 900;
    line-height: 1.75;
    cursor: ${({ isActive }) => (isActive ? 'default' : 'pointer')};
    &:hover {
      color: ${({ theme, isActive }) =>
        isActive ? theme.primary900 : theme.primary700};
    }
  }
`;

const MenuLink = ({ page, location }) => (
  <LinkWrapper isActive={location.pathname === page.path}>
    <Link to={page.path}>{page.name}</Link>
  </LinkWrapper>
);

MenuLink.propTypes = {
  page: PropTypes.object,
  location: PropTypes.object,
};

export default MenuLink;
