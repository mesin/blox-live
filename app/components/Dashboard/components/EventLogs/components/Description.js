import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {publicKeyFormat} from '../../../../../utils/service';
import {EVENTS} from '../constants';

const Wrapper = styled.div`
  color: ${({theme}) => theme.gray800}
`;

const Description = ({value}) => {
  const {type, publicKey} = value;
  const formattedPublicKey = publicKeyFormat(publicKey);
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
