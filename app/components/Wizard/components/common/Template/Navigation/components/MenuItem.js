import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Icon } from '../../../../../../../common/components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  font-size: 14px;
`;

const Circle = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ isActive, theme }) => (isActive ? '#ffffff' : theme.gray80015)};
  background-color: ${({ theme, isActive }) => isActive ? theme.primary900 : 'transparent'};
  border-color: ${({ isActive, theme }) => isActive ? 'transparent' : theme.gray80015};
  border: 2px solid;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 500;
`;

const Text = styled.div`
  color: ${({ isActive, theme }) => isActive ? theme.primary900 : theme.gray80015};
`;

const MenuItem = ({ text, number, step, page, finalPage }) => {
  const isActive = step === number;
  const isDone = page === finalPage || step > number;
  return (
    <Wrapper>
      <Circle isActive={isActive} isDone={isDone}>
        {isDone ? (
          <Icon name="check" color={isActive && isDone ? 'white' : 'gray80015'} fontSize="18px" />
        ) : (
          <span>{number}</span>
        )}
      </Circle>
      <Text isActive={isActive} isDone={isDone}>
        {text}
      </Text>
    </Wrapper>
  );
};

MenuItem.propTypes = {
  page: PropTypes.number,
  finalPage: PropTypes.number,
  step: PropTypes.number,
  text: PropTypes.string,
  number: PropTypes.number,
};

export default MenuItem;
