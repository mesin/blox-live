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
  color: ${({change, theme}) => getChangeColor(change, theme)};
`;

const Apr = ({change: apr}) => {
  const percentage = apr !== undefined ? ((apr / 32) * 100) : null; // TODO 32 hard coded. need to be a initial balance prop.
  return (
    <Wrapper change={Number(apr)}>{percentage !== null ? `${(percentage).toFixed(2)}%` : 'N/A'}</Wrapper>
  );
};

Apr.propTypes = {
  change: PropTypes.string,
};

export default Apr;
