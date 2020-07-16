import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '../../../common';

const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomButton = (props) => {
  const { width, height, title, onClick, isDisabled } = props;
  return (
    <Button
      width={width}
      height={height}
      onClick={onClick}
      isDisabled={isDisabled}
    >
      <TextWrapper>{title}</TextWrapper>
    </Button>
  );
};

CustomButton.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  isDisabled: PropTypes.bool,
};

export default CustomButton;
