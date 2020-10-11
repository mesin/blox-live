import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { ProcessLoader, Button, PasswordInput } from 'common/components';
import { Title, Paragraph, ErrorMessage } from '../../common';
import { useInjectSaga } from 'utils/injectSaga';
import { precentageCalculator } from 'utils/service';

import * as actionsFromProcessRunner from '../../../../ProcessRunner/actions';
import * as selectors from '../../../../ProcessRunner/selectors';
import processRunnerSaga from '../../../../ProcessRunner/saga';

import * as actionsFromKeyvault from '../../../../KeyVaultManagement/actions';
import keyvaultSaga from '../../../../KeyVaultManagement/saga';

import Guide from '../Guide';

const processRunnerKey = 'processRunner';
const keyvaultKey = 'keyvault';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Avenir;
  font-size: 16px;
  font-weight: 500;
`;

const GuideButton = styled.span`
  color:${({theme}) => theme.primary900};
  cursor:pointer;
`;

const PasswordInputsWrapper = styled.div`
  width:570px;
  height: 100px;
  display: flex;
  justify-content:space-between;
  font-size: 16px;
  font-weight: 500;
`;

const ProgressWrapper = styled.div`
  width:58%;
  margin-top:20px;
`;

const CreateServer = (props) => {
  const { page, setPage, isLoading, isDone, processName, error, installMessage, processRunnerActions, keyvaultActions, overallSteps, currentStep } = props;
  const { processSubscribe, processClearState } = processRunnerActions;
  const { keyvaultSavePassword } = keyvaultActions;
  const [accessKeyId, setAccessKeyId] = React.useState('');
  const [secretAccessKey, setSecretAccessKey] = React.useState('');
  const [showGuide, setGuideDisplay] = React.useState(true);
  const isButtonDisabled = !accessKeyId || !secretAccessKey || isLoading || (isDone && !error);
  const isPasswordInputDisabled = isLoading || isDone;
  const loaderPrecentage = precentageCalculator(currentStep, overallSteps);

  useInjectSaga({ key: processRunnerKey, saga: processRunnerSaga, mode: '' });
  useInjectSaga({ key: keyvaultKey, saga: keyvaultSaga, mode: '' });

  React.useEffect(() => {
    if (error) {
      processClearState();
    }
    if (!isLoading && isDone && !error) {
      processClearState();
      setPage(page + 1);
    }
  }, [isLoading, isDone, error]);

  const onClick = async () => {
    if (!isButtonDisabled && !installMessage && !processName) {
      keyvaultSavePassword('temp');
      const credentials = { accessKeyId, secretAccessKey };
      await processSubscribe('install', 'Checking KeyVault configuration...', credentials);
    }
  };

  return (
    <Wrapper>
      <Title>Create your staking KeyVault</Title>
      <Paragraph>
        We will now create your KeyVault on your selected server. <br />
        Blox needs to have access to your AWS access/secret tokens. <br /> <br />
        To create a suitable server and access tokens follow this&nbsp;
        <GuideButton onClick={() => setGuideDisplay(true)}>step-by-step guide</GuideButton>
      </Paragraph>
      <PasswordInputsWrapper>
        <PasswordInput name={'accessKeyId'} title={'Access Key ID'} autoFocus
          onChange={setAccessKeyId} value={accessKeyId} isDisabled={isPasswordInputDisabled}
        />
        <PasswordInput name={'secretAccessKey'} title={'Secret Access Key'} width={'320px'}
          onChange={setSecretAccessKey} value={secretAccessKey} isDisabled={isPasswordInputDisabled}
        />
      </PasswordInputsWrapper>
      <Button isDisabled={isButtonDisabled} onClick={onClick}>Continue</Button>
      {isLoading && installMessage && !error && (
        <ProgressWrapper>
          <ProcessLoader text={installMessage} precentage={loaderPrecentage} />
        </ProgressWrapper>
      )}
      {error && (
        <ErrorMessage>
          {error}, please try again.
        </ErrorMessage>
      )}
      {showGuide && <Guide onClose={() => setGuideDisplay(false)} />}
    </Wrapper>
  );
};

const mapStateToProps = (state) => ({
  processName: selectors.getName(state),
  installMessage: selectors.getMessage(state),
  isLoading: selectors.getIsLoading(state),
  isDone: selectors.getIsDone(state),
  overallSteps: selectors.getOverallSteps(state),
  currentStep: selectors.getCurrentStep(state),
  error: selectors.getError(state),
});

const mapDispatchToProps = (dispatch) => ({
  processRunnerActions: bindActionCreators(actionsFromProcessRunner, dispatch),
  keyvaultActions: bindActionCreators(actionsFromKeyvault, dispatch),
});

CreateServer.propTypes = {
  page: PropTypes.number,
  setPage: PropTypes.func,
  processRunnerActions: PropTypes.object,
  keyvaultActions: PropTypes.object,
  isLoading: PropTypes.bool,
  isDone: PropTypes.bool,
  processName: PropTypes.string,
  installMessage: PropTypes.string,
  overallSteps: PropTypes.number,
  currentStep: PropTypes.number,
  error: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateServer);
