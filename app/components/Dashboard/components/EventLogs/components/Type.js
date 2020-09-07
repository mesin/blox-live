import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Color = {
  POSITIVE: 'accent2400',
  NEUTRAL: 'Gray600',
  NEGATIVE: 'destructive700'
};

const Wrapper = styled.div`
  color: ${({theme, color}) => theme[color]};
  font-size: 14px;
`;

const Type = ({type}) => {
  let title = '';
  let color = null;
  switch (type) {
    case 'key_vault_inactive':
      title = 'KeyVault Inactive';
      color = Color.NEGATIVE;
      break;
    case 'key_vault_active':
      title = 'KeyVault Active';
      color = Color.POSITIVE;
      break;
    case 'validator_assigned':
      title = 'Validator Successfully Assigned';
      color = Color.POSITIVE;
      break;
    case 'validator_pending':
      title = 'Pending Approval';
      color = Color.NEUTRAL;
      break;
    case 'validator_slashed':
      title = 'Validator Slashed';
      color = Color.NEGATIVE;
      break;
    case 'validator_exited':
      title = 'Validator Exited';
      color = Color.NEGATIVE;
      break;
  }
  return (
    <Wrapper color={color}>
      {title}
    </Wrapper>
  );
};

Type.propTypes = {
  type: PropTypes.string,
};

export default Type;
