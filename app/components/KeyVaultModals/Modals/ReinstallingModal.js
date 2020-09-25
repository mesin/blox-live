import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { ProcessLoader } from 'common/components';
import { Title, Description, SmallText, Wrapper } from '..';
import ModalTemplate from '../ModalTemplate';
import { useInjectSaga } from 'utils/injectSaga';
import * as keyVaultActions from '../../ProcessRunner/actions';
import * as selectors from '../../ProcessRunner/selectors';
import saga from '../../ProcessRunner/saga';
import { precentageCalculator } from 'utils/service';

const key = 'processRunner';

const ReinstallingModal = (props) => {
  const { title, description, move1StepForward, move2StepsForward, onClose,
          isLoading, reinstallMessage, isDone, isServerActive, processName,
          actions, overallSteps, currentStep, image
        } = props;
  const { processSubscribe, processClearState } = actions;
  const loaderPrecentage = precentageCalculator(currentStep, overallSteps);

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
      <Title>{title}</Title>
      <Wrapper>
        {description && <Description>{description}</Description>}
        <ProcessLoader text={reinstallMessage} precentage={loaderPrecentage} />
      </Wrapper>
      <SmallText withWarning />
    </ModalTemplate>
  );
};

ReinstallingModal.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  processName: PropTypes.string,
  move1StepForward: PropTypes.func,
  move2StepsForward: PropTypes.func,
  onClose: PropTypes.func,
  actions: PropTypes.object,
  reinstallMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  isDone: PropTypes.bool,
  isServerActive: PropTypes.bool,
  overallSteps: PropTypes.number,
  currentStep: PropTypes.number,
};

const mapStateToProps = (state) => ({
  processName: selectors.getName(state),
  reinstallMessage: selectors.getMessage(state),
  isLoading: selectors.getIsLoading(state),
  isDone: selectors.getIsDone(state),
  isServerActive: selectors.getIsServerActive(state),
  overallSteps: selectors.getOverallSteps(state),
  currentStep: selectors.getCurrentStep(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(keyVaultActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReinstallingModal);
