import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 80px;
  height: 30px;
  padding-right: 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-transform: capitalize;
  color: #ffffff;
  background-color: ${({ theme, color }) => theme[color]};
`;

const STATUSES = {
  active: { name: 'Active', color: 'accent2400' },
  pending: { name: 'Pending', color: 'gray600' },
  exited: { name: 'Exited', color: 'gray400' },
  slashed: { name: 'Slashed', color: 'destructive600' },
  disabled: { name: 'Disabled', color: 'destructive600' },
  unknown_status: { name: 'Unknown', color: 'destructive600' },
};

const Status = ({ status }) => (
  <Wrapper color={STATUSES[status].color}>{STATUSES[status].name}</Wrapper>
);

Status.propTypes = {
  status: PropTypes.string,
};

export default Status;
