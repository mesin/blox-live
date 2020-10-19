import React from 'react';
import styled from 'styled-components';
import { Icon } from '..';

const Wrapper = styled.div<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.warning900};
  border-radius: 50%;
  padding-top:3px;
`;

const FailureIcon = ({ size, fontSize }: Props) => (
  <Wrapper size={size}>
    <Icon name="close" fontSize={fontSize} />
  </Wrapper>
);

FailureIcon.defaultProps = {
  size: '70px',
  fontSize: '60px',
};

type Props = {
  size: string;
  fontSize: string;
};

export default FailureIcon;
