import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 270px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 900;
  border-radius: 6px;
  border-width: ${({ isDisabled }) => (isDisabled ? '1px ' : '0px')};
  border-color: ${({ theme, isDisabled }) => isDisabled ? theme.gray400 : 'transparent'};
  border-style: solid;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  color: ${({ theme, isDisabled }) => (isDisabled ? theme.gray600 : '#ffffff')};
  background-color: ${({ theme, isDisabled }) => isDisabled ? 'transparent' : theme.primary900};
`;

const BigButton = (props) => <Wrapper {...props} />;

export default BigButton;
