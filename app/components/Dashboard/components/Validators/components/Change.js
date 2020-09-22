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

// change !== null

const Change = ({ change }) => {
  const color = getChangeColor(change);
  return (
    <Wrapper color={color}>
      {true ?
        (<EtherNumber value={Number(5.574389574)} fontSize={'14px'} color={color} maximumFractionDigits={9} />)
        : 'N/A'
      }

    </Wrapper>
  );
};

Change.propTypes = {
  change: PropTypes.string,
};

export default Change;
