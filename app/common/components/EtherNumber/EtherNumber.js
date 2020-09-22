import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '../Icon';
import { generateLocaleStringConfig } from 'utils/service';

const Wrapper = styled.div`
  display:flex;
  color:${({theme, color}) => theme[color]};
  font-size:${({fontSize}) => fontSize};
`;

const EtherNumber = ({value, color, fontSize}) => {
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

EtherNumber.propTypes = {
  value: PropTypes.number,
  color: PropTypes.string,
  fontSize: PropTypes.string,
};

export default EtherNumber;
