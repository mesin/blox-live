import React from 'react';
import styled from 'styled-components';

import { ProcessLoader, Button, PasswordInput } from 'common/components';
import { Title, Paragraph, ErrorMessage } from '../../common';

import useCreateServer from 'common/hooks/useCreateServer';

import Guide from '../Guide';

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

const CreateServer = (props: Props) => {
  const { page, setPage } = props;
  const [showGuide, setGuideDisplay] = React.useState(true);

  const onSuccess = () => setPage(page + 1);

  const { isLoading, error, processMessage, loaderPrecentage, accessKeyId, setAccessKeyId,
          secretAccessKey, setSecretAccessKey, onStartProcessClick, isPasswordInputDisabled, isButtonDisabled
        } = useCreateServer({onSuccess});

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
      <Button isDisabled={isButtonDisabled} onClick={() => onStartProcessClick('install')}>Continue</Button>
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


type Props = {
  page: number;
  setPage: (page: number) => void;
};

export default CreateServer;
