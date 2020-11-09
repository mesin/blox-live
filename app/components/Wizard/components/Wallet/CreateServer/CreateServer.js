import React from 'react';
import { shell } from 'electron';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { ProcessLoader, Button, PasswordInput } from 'common/components';
import { Title, Paragraph, ErrorMessage } from '../../common';
import { useInjectSaga } from 'utils/injectSaga';

import * as actionsFromPassword from '../../../../PasswordHandler/actions';
import passwordSaga from '../../../../PasswordHandler/saga';
import useProcessRunner from 'components/ProcessRunner/useProcessRunner';
import Guide from '../Guide';

const passwordKey = 'password';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Avenir;
  font-size: 16px;
  font-weight: 500;
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

const GuideButton = styled.span`
  color:${({theme}) => theme.primary900};
  cursor:pointer;
`;

const ExternalLink = styled.span`
  color:${({theme}) => theme.primary900};
  cursor:pointer;
  &:hover {
    color:${({theme}) => theme.primary600};
  }
`;

const CreateServer = (props) => {
  const { isLoading, isDone, error, processName, processMessage,
          loaderPrecentage, startProcess, clearProcessState } = useProcessRunner();

  const { page, setPage, passwordActions } = props;
  const { savePassword } = passwordActions;
  const [accessKeyId, setAccessKeyId] = React.useState('');
  const [secretAccessKey, setSecretAccessKey] = React.useState('');
  const [showGuide, setGuideDisplay] = React.useState(true);
  const isButtonDisabled = !accessKeyId || !secretAccessKey || isLoading || (isDone && !error);
  const isPasswordInputDisabled = isLoading;

  useInjectSaga({ key: passwordKey, saga: passwordSaga, mode: '' });

  React.useEffect(() => {
    if (!isLoading && isDone && !error) {
      clearProcessState();
      setPage(page + 1);
    }
  }, [isLoading, isDone, error]);

  const onClick = async () => {
    if (!isButtonDisabled && !processMessage && !processName) {
      savePassword('temp');
      const credentials = { accessKeyId, secretAccessKey };
      await startProcess('install', 'Checking KeyVault configuration...', credentials);
    }
  };

  return (
    <Wrapper>
      <Title>Create your staking KeyVault</Title>
      <Paragraph>
        We will now create your KeyVault on your selected server. <br />
        To do that, Blox needs AWS access/secret keys. <br />
        <b>Important</b>: make sure your&nbsp;
        <ExternalLink onClick={() => shell.openExternal('https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/')}>
          AWS account is verified
        </ExternalLink> before creating the keys. <br /> <br />
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
      {isLoading && processMessage && !error && (
        <ProgressWrapper>
          <ProcessLoader text={processMessage} precentage={loaderPrecentage} />
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

const mapDispatchToProps = (dispatch) => ({
  passwordActions: bindActionCreators(actionsFromPassword, dispatch),
});

CreateServer.propTypes = {
  page: PropTypes.number,
  setPage: PropTypes.func,
  passwordActions: PropTypes.object,
};

export default connect(null, mapDispatchToProps)(CreateServer);
