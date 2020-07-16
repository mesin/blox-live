import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  margin-top: 34px;
  border-radius: 7px;
  position: relative;
  background-color: #ffffff;
  display: flex;
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  background-color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.gray5050 : '#ffffff'};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
`;

const BorderPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  border-radius: 7px;
  transition: all 0.5s;
  box-shadow: ${({ theme, isDisabled }) =>
    isDisabled
      ? `${theme.gray600} inset 0px 0px 0px 1px`
      : `${theme.primary900} inset 0px 0px 0px 2px`};
  &:hover {
    box-shadow: ${({ theme, isDisabled }) =>
      isDisabled
        ? `${theme.gray600} inset 0px 0px 0px 1px`
        : `${theme.primary900} inset 0px 0px 0px 4px`};
  }
`;

const Button = (props) => {
  const { width, height, onClick, isDisabled, children } = props;
  return (
    <Wrapper
      width={width}
      height={height}
      isDisabled={isDisabled}
      onClick={onClick}
    >
      <BorderPlaceholder isDisabled={isDisabled} />
      {children}
    </Wrapper>
  );
};

Button.defaultProps = {
  isDisabled: false,
  width: '310px',
  height: '100px',
};

Button.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Button;
