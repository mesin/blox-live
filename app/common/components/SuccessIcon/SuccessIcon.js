import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from '..';

const Wrapper = styled.div`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.accent2400};
  border-radius: 50%;
`;

const SuccessIcon = ({ size, fontSize }) => (
  <Wrapper size={size}>
    <Icon name="check" fontSize={fontSize} />
  </Wrapper>
);

SuccessIcon.defaultProps = {
  size: '70px',
  fontSize: '60px',
};

SuccessIcon.propTypes = {
  size: PropTypes.string,
  fontSize: PropTypes.string,
};

export default SuccessIcon;
