import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SuccessIcon, Button } from 'common/components';
import ModalTemplate from '../ModalTemplate';
import { Title, Description, Wrapper } from '..';
import { loadWallet } from '../../../Wizard/actions';

import image from '../../../Wizard/assets/img-key-vault.svg';

const ReactivatedModal = ({onClose, callLoadWallet}) => {
  const loadWalletAndClose = () => {
    callLoadWallet();
    onClose();
  };
  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Wrapper>
        <SuccessIcon size={'40px'} fontSize={'30px'} />
        <Title fontSize={'32px'} color={'accent2400'}>Reactivating your KeyVault</Title>
      </Wrapper>
      <Description>
        KeyVault is active and all validators are staking normally. We are investigating what caused the issue.
      </Description>
      <Button onClick={loadWalletAndClose}>Return to Dashboard</Button>
    </ModalTemplate>
  );
};

ReactivatedModal.propTypes = {
  onClose: PropTypes.func,
  callLoadWallet: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  callLoadWallet: () => dispatch(loadWallet()),
});

export default connect(null, mapDispatchToProps)(ReactivatedModal);
