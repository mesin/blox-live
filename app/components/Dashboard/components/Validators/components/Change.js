import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const getChangeColor = (change, theme) => {
  if (change > 0) {
    return theme.plgreen;
  }
  if (change < 0) {
    return theme.plred;
  }
  return theme.gray800;
};

const Wrapper = styled.div`
  color: ${({ change, theme }) => getChangeColor(change, theme)};
`;

const Change = ({ change }) => (
  <Wrapper change={change}>{change !== null ? `${Number(change).toFixed(2)} ETH` : 'N/A'}</Wrapper>
);

Change.propTypes = {
  change: PropTypes.string,
};

export default Change;
