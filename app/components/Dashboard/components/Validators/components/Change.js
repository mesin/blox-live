import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EtherNumber } from 'common/components';

const getChangeColor = (change) => {
  if (change > 0) {
    return 'plgreen';
  }
  if (change < 0) {
    return 'plred';
  }
  return 'gray800';
};

const Wrapper = styled.div`
  color: ${({ color, theme }) => theme[color]};
  display:flex;
`;

const Change = ({ change }) => {
  const color = getChangeColor(change);
  return (
    <Wrapper color={color}>
      {change !== null ?
        (<EtherNumber value={Number(change)} fontSize={'14px'} color={color} />)
        : 'N/A'
      }

    </Wrapper>
  );
};

Change.propTypes = {
  change: PropTypes.string,
};

export default Change;
