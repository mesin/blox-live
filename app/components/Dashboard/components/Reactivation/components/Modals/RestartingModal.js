import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ProgressBar } from 'common/components';
import { Title, ProgressMessage, SmallText } from '..';
import ModalTemplate from '../ModalTemplate';
import { useInjectSaga } from '../../../../../../utils/injectSaga';
import * as keyVaultActions from '../../../../../KeyVaultManagement/actions';
import * as selectors from '../../../../../KeyVaultManagement/selectors';
import saga from '../../../../../KeyVaultManagement/saga';

import image from '../../../../../Wizard/assets/img-key-vault-inactive.svg';

const key = 'keyVaultManagement';

const RestartingModal = (props) => {
  const {moveForward, onClose, isLoading, restartMessage, isDone, processName, actions} = props;
  const { keyvaultProcessSubscribe, keyvaultProcessClearState } = actions;
  useInjectSaga({ key, saga, mode: '' });
  useEffect(() => {
    if (isDone) {
      keyvaultProcessClearState();
      moveForward();
    }
    if (!isDone && !isLoading && !restartMessage && !processName) {
      keyvaultProcessSubscribe('restart', 'Checking KeyVault configuration...');
    }
  }, [isLoading, isDone, restartMessage]);

  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Restarting KeyVault</Title>
      <ProgressBar />
      <ProgressMessage>{restartMessage}</ProgressMessage>
      <SmallText>This process is automated and only takes a few minutes.</SmallText>
    </ModalTemplate>
  );
};

RestartingModal.propTypes = {
  processName: PropTypes.string,
  moveForward: PropTypes.func,
  onClose: PropTypes.func,
  actions: PropTypes.object,
  restartMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  isDone: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  processName: selectors.getName(state),
  restartMessage: selectors.getMessage(state),
  isLoading: selectors.getIsLoading(state),
  isDone: selectors.getIsDone(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(keyVaultActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RestartingModal);
