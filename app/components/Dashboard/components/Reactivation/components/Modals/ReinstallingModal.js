import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ProgressBar } from 'common/components';
import { Title, Description, ProgressMessage, SmallText } from '..';
import ModalTemplate from '../ModalTemplate';
import { useInjectSaga } from '../../../../../../utils/injectSaga';
import * as keyVaultActions from '../../../../../KeyVaultManagement/actions';
import * as selectors from '../../../../../KeyVaultManagement/selectors';
import saga from '../../../../../KeyVaultManagement/saga';

import image from '../../../../../Wizard/assets/img-key-vault-inactive.svg';

const key = 'keyVaultManagement';

const ReinstallingModal = (props) => { // TODO: check the reinstallMessage param
  const {moveForward, onClose, isLoading, reinstallMessage, isDone, processName, actions} = props;
  const { keyvaultProcessSubscribe, keyvaultProcessClearState } = actions;
  useInjectSaga({ key, saga, mode: '' });
  useEffect(() => {
    // if (isDone) {
    //   moveForward();
    //   keyvaultProcessClearState();
    // }
    if (!isDone && !isLoading && !reinstallMessage && !processName) {
      keyvaultProcessSubscribe('reinstall', 'Checking KeyVault configuration...');
    }
  }, [isLoading, isDone, reinstallMessage]);

  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Reinstalling KeyVault</Title>
      <Description>KeyVault still inactive. Starting the reinstall process.</Description>
      <ProgressBar />
      <ProgressMessage>{reinstallMessage}</ProgressMessage>
      <SmallText>This process is automated and only takes a few minutes.</SmallText>
    </ModalTemplate>
  );
};

ReinstallingModal.propTypes = {
  processName: PropTypes.string,
  moveForward: PropTypes.func,
  onClose: PropTypes.func,
  actions: PropTypes.object,
  reinstallMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  isDone: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  processName: selectors.getName(state),
  reinstallMessage: selectors.getMessage(state),
  isLoading: selectors.getIsLoading(state),
  isDone: selectors.getIsDone(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(keyVaultActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReinstallingModal);