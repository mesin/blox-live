import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ProgressBar, ProgressMessage } from 'common/components';
import { Title, Description, SmallText, Wrapper } from '..';
import ModalTemplate from '../ModalTemplate';
import { useInjectSaga } from 'utils/injectSaga';
import * as keyVaultActions from '../../../ProcessRunner/actions';
import * as selectors from '../../../ProcessRunner/selectors';
import saga from '../../../ProcessRunner/saga';

import image from '../../../Wizard/assets/img-key-vault-inactive.svg';

const key = 'processRunner';

const ReinstallingModal = (props) => {
  const {move1StepForward, move2StepsForward, onClose, isLoading, reinstallMessage, isDone, isServerActive, processName, actions} = props;
  const { processSubscribe, processClearState } = actions;
  useInjectSaga({ key, saga, mode: '' });
  useEffect(() => {
    if (isDone) {
      processClearState();
      if (isServerActive) { move1StepForward(); }
      else { move2StepsForward(); }
    }
    if (!isDone && !isLoading && !reinstallMessage && !processName) {
      processSubscribe('reinstall', 'Checking KeyVault configuration...');
    }
  }, [isLoading, isDone, reinstallMessage]);

  return (
    <ModalTemplate onClose={onClose} image={image}>
      <Title>Reinstalling KeyVault</Title>
      <Wrapper>
        <Description>KeyVault still inactive. Starting the reinstall process.</Description>
        <ProgressBar />
        <ProgressMessage>{reinstallMessage}</ProgressMessage>
      </Wrapper>
      <SmallText>This process is automated and only takes a few minutes.</SmallText>
    </ModalTemplate>
  );
};

ReinstallingModal.propTypes = {
  processName: PropTypes.string,
  move1StepForward: PropTypes.func,
  move2StepsForward: PropTypes.func,
  onClose: PropTypes.func,
  actions: PropTypes.object,
  reinstallMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  isDone: PropTypes.bool,
  isServerActive: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  processName: selectors.getName(state),
  reinstallMessage: selectors.getMessage(state),
  isLoading: selectors.getIsLoading(state),
  isDone: selectors.getIsDone(state),
  isServerActive: selectors.getIsServerActive(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(keyVaultActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReinstallingModal);
