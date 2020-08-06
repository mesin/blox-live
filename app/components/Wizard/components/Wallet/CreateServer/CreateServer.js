import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { ProgressBar, ProgressMessage, Button } from 'common/components';
import { Title, Paragraph, Link } from '../../common';
import { useInjectSaga } from '../../../../../utils/injectSaga';
import * as keyVaultActions from '../../../../KeyVaultManagement/actions';
import * as selectors from '../../../../KeyVaultManagement/selectors';
import saga from '../../../../KeyVaultManagement/saga';

const key = 'keyVaultManagement';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: Avenir;
  font-size: 16px;
  font-weight: 500;
`;

const TextFieldsWrapper = styled.div`
  width:55%;
  height: 100px;
  display: flex;
  justify-content:space-between;
  font-size: 16px;
  font-weight: 500;
`;

const TextFieldWrapper = styled.div`
  width:200px;
  height:70px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
`;

const Label = styled.label``;

const TextField = styled.input`
  width: 230px;
  height: 36px;
  color:${({theme}) => theme.gray600};
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  border: solid 1px ${({theme}) => theme.gray300};
  padding:8px 12px;
`;

const ProgressWrapper = styled.div`
  width:58%;
  margin-top:20px;
`;

const CreateServer = (props) => {
  const { page, setPage, isLoading, isDone, processName, installMessage, actions } = props;
  const { keyvaultSetCredentials, keyvaultProcessSubscribe, keyvaultProcessClearState } = actions;
  const [accessKeyId, setAccessKeyId] = React.useState('AKIARYXLX53R4KHH3PTF');
  const [secretAccessKey, setSecretAccessKey] = React.useState('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');
  const isButtonDisabled = !accessKeyId || !secretAccessKey || isLoading;

  useInjectSaga({ key, saga, mode: '' });

  React.useEffect(() => {
    if (!isLoading && isDone) {
      debugger;
      keyvaultProcessClearState();
      setPage(page + 1);
    }
  }, [isLoading, isDone]);

  const onClick = async () => {
    if (!isButtonDisabled && !installMessage && !processName) {
      await keyvaultSetCredentials(accessKeyId, secretAccessKey);
      await keyvaultProcessSubscribe('install', 'Checking KeyVault configuration...');
    }
  };

  return (
    <Wrapper>
      <Title>Create your staking KeyVault</Title>
      <Paragraph>
        We will now create your KeyVault on your selected server. <br />
        Blox needs to have access to your AWS access/secret tokens. <br /> <br />

        To create a suitable sever and access tokens follow this&nbsp;
        <Link href="https://www.bloxstaking.com/blox-guide-why-blox-need-access-to-my-server" target="_blank">
          step-by-step guide
        </Link>
      </Paragraph>
      <TextFieldsWrapper>
        <TextFieldWrapper>
          <Label htmlFor={'accessKeyId'}>Access Key ID</Label>
          <TextField id={'accessKeyId'} type={'text'} value={accessKeyId}
            onChange={(e) => setAccessKeyId(e.target.value)}
          />
        </TextFieldWrapper>
        <TextFieldWrapper>
          <Label htmlFor={'secretAccessKey'}>Secret Access Key</Label>
          <TextField id={'secretAccessKey'} type={'text'} value={secretAccessKey}
            onChange={(e) => setSecretAccessKey(e.target.value)}
          >
          </TextField>
        </TextFieldWrapper>
      </TextFieldsWrapper>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateServer);
