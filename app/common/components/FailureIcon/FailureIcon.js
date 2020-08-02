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
  background-color: ${({ theme }) => theme.warning900};
  border-radius: 50%;
  padding-top:3px;
`;

const FailureIcon = ({ size, fontSize }) => (
  <Wrapper size={size}>
    <Icon name="close" fontSize={fontSize} />
  </Wrapper>
);

FailureIcon.defaultProps = {
  size: '70px',
  fontSize: '60px',
};

FailureIcon.propTypes = {
  size: PropTypes.string,
  fontSize: PropTypes.string,
};

export default FailureIcon;
