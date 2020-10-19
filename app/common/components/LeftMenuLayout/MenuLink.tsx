import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LinkWrapper = styled.div<{ isActive: boolean }>`
  margin-bottom: 35px;
  a {
    color: ${({ theme, isActive }) => isActive ? theme.primary900 : theme.gray600};
    text-decoration: none;
    font-size: 16px;
    font-weight: 900;
    line-height: 1.75;
    cursor: ${({ isActive }) => (isActive ? 'default' : 'pointer')};
    &:hover {
      color: ${({ theme, isActive }) => isActive ? theme.primary900 : theme.primary700};
    }
  }
`;

const MenuLink = ({ page, location }: Props) => (
  <LinkWrapper isActive={location.pathname === page.path}>
    <Link to={page.path}>{page.name}</Link>
  </LinkWrapper>
);

type Props = {
  page: Record<string, any>;
  location: Record<string, any>;
};

export default MenuLink;
