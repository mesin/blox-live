import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Tooltip } from 'common/components';
import { STATUSES } from '../../../constants';

const Wrapper = styled.div`
  width: 80px;
  height: 30px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  color: #ffffff;
  background-color: ${({ theme, color }) => theme[color]};
`;

const pendingTooltipText = `
  Approving your validator can sometime take between 4 to 24 hours or longer,
  depending on the validator activation queue.
  We will notify you via email once your validator is approved and is
  actively staking on the ETH 2 network.
`;

const Status = ({ status }) => {
  if (STATUSES[status]) {
    if (STATUSES[status].name === 'Pending') {
      return (
        <Tooltip title={pendingTooltipText} placement={'bottom'}>
          <Wrapper color={STATUSES[status].color}>{STATUSES[status].name}</Wrapper>
        </Tooltip>
      );
    }
    return <Wrapper color={STATUSES[status].color}>{STATUSES[status].name}</Wrapper>;
  }
  return null;
};

Status.propTypes = {
  status: PropTypes.string,
};

export default Status;
