import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import { isActive } from '../../../utils/service';

const Wrapper = styled(Link)`
  display: inline-flex;
  text-decoration: none;
  user-select: none;
  cursor: pointer;
  outline: 0;
  font-size: 14px;
  font-weight: 900;
  color: ${({ theme, active }) => active ? theme.accent2400 : theme.accent250};
  margin: 0px 20px;
  &:hover {
    color: ${({ theme, active }) => active ? theme.accent2400 : theme.accent2200};
  }
`;

const Icon = styled.i`
  display: flex;
  align-items: center;
  font-size: 22px;
`;

const Name = styled.span`
  margin-left: 10px;
`;

const HeaderLink = (props) => {
  const { to, name, iconName, location } = props;
  const active = isActive(to, location.pathname);
  return (
    <Wrapper to={to} active={active}>
      <Icon className={`icon-${iconName}`} active={active} />
      <Name>{name}</Name>
    </Wrapper>
  );
};

HeaderLink.propTypes = {
  to: PropTypes.string,
  name: PropTypes.string,
  iconName: PropTypes.string,
  location: PropTypes.object,
};

export default withRouter(HeaderLink);
