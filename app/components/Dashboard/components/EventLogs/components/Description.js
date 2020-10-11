import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {EVENTS} from '../constants';
import { truncateText } from 'components/common/service';

const Wrapper = styled.div`
  color: ${({theme}) => theme.gray800};
`;

const Description = ({value}) => {
  const {type, publicKey} = value;
  const formattedPublicKey = truncateText(publicKey, 12, 6);
  const {description} = EVENTS[type];
  return (
    <Wrapper>
      {description.includes('{}') ? description.replace('{}', formattedPublicKey) : description}
    </Wrapper>
  );
};

Description.propTypes = {
  value: PropTypes.object,
};

export default Description;
