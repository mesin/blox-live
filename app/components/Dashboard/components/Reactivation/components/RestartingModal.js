import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ProgressBar } from 'common/components';
import ModalTemplate from './ModalTemplate';
import { useInjectSaga } from '../../../../../utils/injectSaga';
import { keyvaultRestart } from '../../../../KeyVaultManagement/actions';
import saga from '../../../../KeyVaultManagement/saga';

import image from '../../../../Wizard/assets/img-key-vault-inactive.svg';

const key = 'keyvaultRestart';

const Title = styled.h1`
  font-size: 26px;
  font-weight: 900;
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.71;
  padding-bottom:24px;
`;

const SmallText = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({theme}) => theme.gray600};
  padding-bottom:54px;
`;

const Button = styled.button`
  width: 175px;
  height: 32px;
  font-size: 14px;
  font-weight: 900;
  display:flex;
  align-items:center;
  justify-content:center;
  background-color: ${({theme}) => theme.primary900};
  border-radius: 6px;
  color:${({theme}) => theme.gray50};
  border:0px;
`;

const RestartingModal = ({moveForward, onClose, callKeyvaultRestart}) => {
  useInjectSaga({ key, saga, mode: '' });

  useEffect(() => {
    debugger;
    callKeyvaultRestart();
  });

  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Restarting Modal</Title>
      <ProgressBar />
      <SmallText>This process is automated and only takes a few minutes.</SmallText>
    </ModalTemplate>
  )
};

RestartingModal.propTypes = {
  moveForward: PropTypes.func,
  onClose: PropTypes.func,
  callKeyvaultRestart: PropTypes.func,
};

// const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = (dispatch) => ({
  callKeyvaultRestart: () => dispatch(keyvaultRestart()),
});

export default connect(null, mapDispatchToProps)(RestartingModal);
