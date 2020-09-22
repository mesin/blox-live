import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EtherNumber } from 'common/components';

const Wrapper = styled.div`
  display:flex;
`;

// balance !== null

const Balance = ({ balance }) => (
  <Wrapper>{true ? (
    <EtherNumber fontSize={'14px'} color={'gray800'} value={4234324.432423432} maximumFractionDigits={5} />
  ) : 'N/A'}
  </Wrapper>
);

Balance.propTypes = {
  balance: PropTypes.string,
};

export default Balance;
