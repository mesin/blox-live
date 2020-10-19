import React from 'react';
import styled from 'styled-components';
import { Icon } from '..';

const Wrapper = styled.div<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.accent2400};
  border-radius: 50%;
`;

const SuccessIcon = ({ size, fontSize }: Props) => (
  <Wrapper size={size}>
    <Icon name="check" fontSize={fontSize} color={'#ffffff'} />
  </Wrapper>
);

SuccessIcon.defaultProps = {
  size: '70px',
  fontSize: '60px',
};

type Props = {
  size: string,
  fontSize: string,
};

export default SuccessIcon;
