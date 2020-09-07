import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { Icon } from '../../../../../../../common/components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  font-size: 12px;
  padding-top: 26px;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 23px;
    background-color: ${({ theme }) => theme.gray80015};
    top: 0px;
    left: 11px;
    display: ${({ number }) => (number > 1 ? 'block' : 'none')};
  }
`;

const circleAnimation = keyframes`
  0% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
`;

const Circle = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 16px;
  margin-left: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border: 2px solid ${({ theme }) => theme.gray80015};
  border-radius: 50%;
  font-weight: 500;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: ${({ theme, isActive }) => isActive ? theme.primary900 : 'transparent'};
    top: 1px;
    left: 1px;
    border-radius: 50%;
    animation: ${circleAnimation} 1s;
  }
`;

const SubMenuItem = ({ text, number, page }) => {
  const isActive = page === number;
  const isDone = page > number;
  return (
    <Wrapper number={number}>
      <Circle isActive={isActive} isDone={isDone}>
        {isDone && <Icon name="check" color="gray80015" />}
      </Circle>
      {text}
    </Wrapper>
  );
};

SubMenuItem.propTypes = {
  text: PropTypes.string,
  number: PropTypes.number,
  page: PropTypes.number,
};

export default SubMenuItem;
