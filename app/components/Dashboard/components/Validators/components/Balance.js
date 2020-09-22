import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EtherNumber } from 'common/components';

const Wrapper = styled.div`
  display:flex;
`;

const Balance = ({ balance }) => (
  <Wrapper>{balance !== null ? (
    <EtherNumber fontSize={'14px'} color={'gray800'} value={balance} />
  ) : 'N/A'}
  </Wrapper>
);

Balance.propTypes = {
  balance: PropTypes.string,
};

export default Balance;
