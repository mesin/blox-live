import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SuccessIcon, Button, ModalTemplate } from 'common/components';
import { Title, Description, Wrapper } from 'common/components/ModalTemplate/components';
import { loadWallet } from '../Wizard/actions';

import image from '../Wizard/assets/img-key-vault.svg';

const SuccessModal = ({onClose, callLoadWallet, title, text}) => {
  const loadWalletAndClose = () => {
    callLoadWallet();
    onClose();
  };
  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Wrapper>
        <SuccessIcon size={'40px'} fontSize={'30px'} />
        <Title fontSize={'32px'} color={'accent2400'}>{title}</Title>
      </Wrapper>
      <Description>{text}</Description>
      <Button onClick={loadWalletAndClose}>Return to Dashboard</Button>
    </ModalTemplate>
  );
};

SuccessModal.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  onClose: PropTypes.func,
  callLoadWallet: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  callLoadWallet: () => dispatch(loadWallet()),
});

export default connect(null, mapDispatchToProps)(SuccessModal);
