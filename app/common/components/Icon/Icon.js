import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Regular = styled.i`
  font-size: ${({ fontSize }) => fontSize || '12px'};
  display: flex;
  align-items: center;
  color: ${({ theme, color, }) => (color && theme[color]) || '#ffffff'};
`;

const Clickable = styled(Regular)`
  cursor: pointer;
  :hover {
    color: ${({ theme, color }) => (color && theme.primary700) || '#ffffff'};
  }
  :active {
    color: ${({ theme, color }) => (color && theme.primary800) || '#ffffff'};
  }
`;

const Icon = ({ name, color, fontSize, onClick, isDisabled }) => onClick ?
  (
    <Clickable
      className={`icon-${name}`}
      color={color}
      fontSize={fontSize}
      onClick={onClick}
      isDisabled={isDisabled}
    />
  ) : (
    <Regular
      className={`icon-${name}`}
      color={color}
      fontSize={fontSize}
      isDisabled={isDisabled}
    />
  );

Icon.propTypes = {
  name: PropTypes.string,
  isDisabled: PropTypes.bool,
  fontSize: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default Icon;
