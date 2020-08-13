import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { ProgressBar, ProgressMessage, Button } from 'common/components';
import { useInjectSaga } from 'utils/injectSaga';

import { Title, Paragraph, Link, TextInput } from '../../common';
import * as keyVaultActions from '../../../../ProcessRunner/actions';
import * as selectors from '../../../../ProcessRunner/selectors';
import saga from '../../../../ProcessRunner/saga';
import { getIdToken } from '../../../../CallbackPage/selectors';

const key = 'processRunner';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Avenir;
  font-size: 16px;
  font-weight: 500;
`;

const TextInputsWrapper = styled.div`
  width:55%;
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
  const { page, setPage, isLoading, isDone, processName, installMessage, actions, authToken } = props;
  const { processSubscribe, processClearState } = actions;
  const [accessKeyId, setAccessKeyId] = React.useState('');
  const [secretAccessKey, setSecretAccessKey] = React.useState('');
  const isButtonDisabled = !accessKeyId || !secretAccessKey || isLoading || isDone;
  const isTextInputDisabled = isLoading || isDone;

  useInjectSaga({ key, saga, mode: '' });

  React.useEffect(() => {
    if (!isLoading && isDone) {
      processClearState();
      setPage(page + 1);
    }
  }, [isLoading, isDone]);

  const onClick = async () => {
    if (!isButtonDisabled && !installMessage && !processName) {
      const credentials = { accessKeyId, secretAccessKey, authToken };
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
        <Link href="https://www.bloxstaking.com/blox-guide-why-blox-need-access-to-my-server" target="_blank">
          step-by-step guide
        </Link>
      </Paragraph>
      <TextInputsWrapper>
        <TextInput name={'accessKeyId'} title={'Access Key ID'} type={'text'}
          onChange={setAccessKeyId} value={accessKeyId} isDisabled={isTextInputDisabled}
        />
        <TextInput name={'secretAccessKey'} title={'Secret Access Key'} type={'text'}
          onChange={setSecretAccessKey} value={secretAccessKey} isDisabled={isTextInputDisabled}
        />
      </TextInputsWrapper>
      <Button isDisabled={isButtonDisabled} onClick={onClick}>Continue</Button>
      {isLoading && installMessage && (
        <ProgressWrapper>
          <ProgressBar />
          <ProgressMessage>{installMessage}</ProgressMessage>
        </ProgressWrapper>
      )}
    </Wrapper>
  );
};

const mapStateToProps = (state) => ({
  processName: selectors.getName(state),
  installMessage: selectors.getMessage(state),
  isLoading: selectors.getIsLoading(state),
  isDone: selectors.getIsDone(state),
  authToken: getIdToken(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(keyVaultActions, dispatch),
});

CreateServer.propTypes = {
  page: PropTypes.number,
  setPage: PropTypes.func,
  actions: PropTypes.object,
  isLoading: PropTypes.bool,
  isDone: PropTypes.bool,
  processName: PropTypes.string,
  installMessage: PropTypes.string,
  authToken: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateServer);
