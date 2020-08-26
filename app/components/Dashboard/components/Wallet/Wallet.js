import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Boxes, StatusBar } from './components';

const Wrapper = styled.div`
  width: 100%;
  height: 300px;
`;

const Wallet = (props) => {
  const { isActive, ...rest } = props;
  return (
    <Wrapper>
      <StatusBar isActive={isActive} />
      <Boxes isActive={isActive} {...rest} />
    </Wrapper>
  );
};

Wallet.propTypes = {
  isActive: PropTypes.bool,
  summary: PropTypes.object,
};

export default Wallet;
