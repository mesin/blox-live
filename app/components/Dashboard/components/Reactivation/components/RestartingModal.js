import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ProgressBar } from 'common/components';
import ModalTemplate from './ModalTemplate';
import { useInjectSaga } from '../../../../../utils/injectSaga';
import { keyvaultProcessSubscribe } from '../../../../KeyVaultManagement/actions';
import saga from '../../../../KeyVaultManagement/saga';
import { getMessage, getIsLoading } from '../../../../KeyVaultManagement/selectors';

import image from '../../../../Wizard/assets/img-key-vault-inactive.svg';

const key = 'keyVaultManagement';

const Title = styled.h1`
  font-size: 26px;
  font-weight: 900;
`;

const RestartingMessage = styled.div`
  color: ${({theme}) => theme.primary900};
  font-size:12px;
  margin-top:7px;
`;

const SmallText = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({theme}) => theme.gray600};
  padding-top:54px;
`;

const RestartingModal = ({moveForward, onClose, callKeyvaultRestart, isLoading, restartMessage}) => {
  useInjectSaga({ key, saga, mode: '' });
  useEffect(() => {
    if (!isLoading && !restartMessage) {
      callKeyvaultRestart();
    }
  }, [isLoading, restartMessage]);

  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Restarting Modal</Title>
      <ProgressBar />
      <RestartingMessage>{restartMessage}</RestartingMessage>
      <SmallText>This process is automated and only takes a few minutes.</SmallText>
    </ModalTemplate>
  );
};

RestartingModal.propTypes = {
  moveForward: PropTypes.func,
  onClose: PropTypes.func,
  callKeyvaultRestart: PropTypes.func,
  restartMessage: PropTypes.string,
  isLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  restartMessage: getMessage(state),
  isLoading: getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  callKeyvaultRestart: () => dispatch(keyvaultProcessSubscribe('restart')),
});

export default connect(mapStateToProps, mapDispatchToProps)(RestartingModal);
