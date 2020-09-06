import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Icon } from 'common/components';

const Wrapper = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 500;
`;

const Regular = styled(Wrapper)`
  color: ${({ isActive, theme }) => (isActive ? '#ffffff' : theme.gray80015)};
  background-color: ${({ theme, isActive }) => isActive ? theme.primary900 : 'transparent'};
  border-color: ${({ isActive, theme }) => isActive ? 'transparent' : theme.gray80015};
`;

const WithoutNumber = styled(Wrapper)`
  color: #ffffff;
  background-color: #ffffff;
  border-color:${({ theme }) => theme.primary900};
`;

const MenuItem = ({ isActive, isDone, number, hideNumber }) => {
  return (hideNumber && !isDone) ? (
    <WithoutNumber isActive={isActive} isDone={isDone} />
  ) : (
    <Regular isActive={isActive} isDone={isDone}>
      {isDone ? (
        <Icon name="check" color={isActive && isDone ? 'white' : 'gray80015'} fontSize="18px" />
      ) : (
        <span>{number}</span>
      )}
    </Regular>
  );
};

MenuItem.propTypes = {
  isActive: PropTypes.bool,
  isDone: PropTypes.bool,
  number: PropTypes.number,
  hideNumber: PropTypes.bool,
};

export default MenuItem;
