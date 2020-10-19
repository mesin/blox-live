import React from 'react';
import styled from 'styled-components';
import Icon from '../Icon';
import { generateLocaleStringConfig } from 'utils/service';

const Wrapper = styled.div<{ fontSize: string }>`
  display:flex;
  color:${({theme, color}) => theme[color]};
  font-size:${({fontSize}) => fontSize};
`;

const EtherNumber = ({value, color, fontSize}: Props) => {
  const localeConfig = generateLocaleStringConfig(value);
  const isMinus = value < 0;
  const number = isMinus ? Math.abs(value) : value;
  const formattedNumber = number.toLocaleString(undefined, localeConfig);
  return (
    <Wrapper color={color} fontSize={fontSize}>
      {isMinus && '-'}
      <Icon name={'eth-icon-colors'} fontSize={fontSize} color={color} />
      {formattedNumber}
    </Wrapper>
  );
};

type Props = {
  value: number;
  color: string;
  fontSize: string;
};

export default EtherNumber;
