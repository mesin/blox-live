import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Icon } from '../../../../../common/components';

const Wrapper = styled.div`
  width: 20vw;
  height: 100px;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 ${({ theme }) => theme.gray80015};
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  cursor: pointer;
`;

const CheckBox = styled.div`
  width: 40px;
  height: 40px;
  border-color: ${({ theme, isActive }) =>
    isActive ? theme.primary900 : theme.gray400};
  border-width: 2px;
  border-style: solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.primary900 : 'transparent'};
  transition: 0.25s all;
`;

const Button = ({ text, isActive, onClick }) => (
  <Wrapper onClick={onClick}>
    <CheckBox isActive={isActive}>
      {isActive && <Icon name="check" fontSize="34px" />}
    </CheckBox>
    {text}
  </Wrapper>
);

Button.propTypes = {
  text: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
