import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {publicKeyFormat} from '../../../../../utils/service';

const Wrapper = styled.div`
  color: ${({theme}) => theme.gray800}
`;

const Description = ({value}) => {
  const {type, publicKey} = value;
  const formatetPublicKey = publicKeyFormat(publicKey);
  let title = '';
  switch (type) {
    case 'key_vault_inactive':
      title = 'Blox was unable to communicate with your KeyVault';
      break;
    case 'key_vault_active':
      title = 'KeyVault became active';
      break;
    case 'validator_assigned':
      title = `Validator ${formatetPublicKey} was successfully assigned.`;
      break;
    case 'validator_pending':
      title = `Validator ${formatetPublicKey} became pending for approval.`;
      break;
    case 'validator_slashed':
      title = `Validator ${formatetPublicKey} was Slashed due to inactivity.`;
      break;
    case 'validator_exited':
      title = `Validator ${formatetPublicKey} was exited.`;
      break;
  }
  return (
    <Wrapper>
      {title}
    </Wrapper>
  );
};

Description.propTypes = {
  value: PropTypes.object,
};

export default Description;
