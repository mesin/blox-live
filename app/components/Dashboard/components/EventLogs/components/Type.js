import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {EVENTS} from '../constants';

const Wrapper = styled.div`
  color: ${({theme, color}) => theme[color]};
  font-size: 14px;
`;

const Type = ({type}) => {
  const {title, color } = EVENTS[type];
  return (
    <Wrapper color={color}>
      {title}
    </Wrapper>
  );
};

Type.propTypes = {
  type: PropTypes.string,
};

export default Type;
