import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import MenuItemCircle from './MenuItemCircle';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  font-size: 14px;
`;

const Text = styled.div`
  color: ${({ isActive, theme }) => isActive ? theme.primary900 : theme.gray80015};
`;

const MenuItem = ({ text, number, step, page, finalPage, hideNumber }) => {
  const isActive = step === number;
  const isDone = page === finalPage || step > number;
  return (
    <Wrapper>
      <MenuItemCircle number={number} hideNumber={hideNumber} isActive={isActive} isDone={isDone} />
      <Text isActive={isActive} isDone={isDone}>{text}</Text>
    </Wrapper>
  );
};

MenuItem.propTypes = {
  page: PropTypes.number,
  finalPage: PropTypes.number,
  step: PropTypes.number,
  text: PropTypes.string,
  number: PropTypes.number,
  hideNumber: PropTypes.bool,
};

export default MenuItem;
