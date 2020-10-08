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

const Apr = ({change}) => {
  const percentage = change ? Number(change) : null;
  return (
    <Wrapper change={Number(change)}>{percentage !== null ? `${(percentage).toFixed(2)}%` : 'N/A'}</Wrapper>
  );
};

Apr.propTypes = {
  change: PropTypes.string,
};

export default Apr;
