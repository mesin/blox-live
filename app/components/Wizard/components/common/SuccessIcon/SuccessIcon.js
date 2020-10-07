import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon } from '../../../../../common/components';

const Wrapper = styled.div`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  margin-bottom: 16px;
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
  size: '60px',
  fontSize: '50px',
};

SuccessIcon.propTypes = {
  size: PropTypes.string,
  fontSize: PropTypes.string,
};

export default SuccessIcon;
