import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { ModalTemplate, Button, PasswordInput, Spinner } from 'common/components';
import { Title, Description } from 'common/components/ModalTemplate/components';

import useCreateServer from 'common/hooks/useCreateServer';
import * as actionsFromKeyvault from '../../KeyVaultManagement/actions';
import * as keyvaultSelectors from '../../KeyVaultManagement/selectors';
import Store from 'backend/common/store-manager/store';

import image from 'assets/images/img-recovery.svg';

const StepIndicator = styled.div`
  font-size: 12px;
  font-weight: 500;
  color:${({theme}) => theme.gray400};
  margin-bottom:8px;
`;

const PasswordInputsWrapper = styled.div`
  width: 400px;
  height: 150px;
  margin:21px 0px;
  display: flex;
  flex-direction:column;
  justify-content:space-between;
  font-size: 16px;
  font-weight: 500;
`;

const ButtonWrapper = styled.div`
  margin-top:41px;
`;

const Message = styled.span<{ error?: string }>`
  font-size: 12px;
  font-weight: 900;
  line-height: 1.67;
  color: ${({theme, error}) => error ? theme.destructive600 : theme.primary900};
`;

const LoadingWrapper = styled.div`
  display:flex;
  align-items: center;
  margin-top: 8px;
  width: 90%;
  justify-content: space-between;
`;

const Step1Modal = (props: Props) => {
  const {onClick, onClose, areAwsKeyvsValid, isValidLoading, isValidError, keyvaultActions} = props;
  const { validateAwsKeys, clearAwsKeysState } = keyvaultActions;

  React.useEffect(() => {
    if (areAwsKeyvsValid && !isValidError && !isValidLoading) {
      const store: Store = Store.getStore();
      store.set('inRecoveryProcess', true);
      onStartProcessClick('recovery');
      clearAwsKeysState();
    }
  }, [isValidLoading]);

  const onStart = () => onClick();

  const { accessKeyId, setAccessKeyId, secretAccessKey, setSecretAccessKey,
          onStartProcessClick, isPasswordInputDisabled, isButtonDisabled
        } = useCreateServer({onStart});

  const onButtonClick = () => validateAwsKeys({accessKeyId, secretAccessKey});

  return (
    <ModalTemplate height={'560px'} padding={'30px 32px 30px 64px'} justifyContent={'initial'} onClose={onClose} image={image}>
      <Title>Recover Account Data</Title>
      <StepIndicator>Step 02</StepIndicator>
      <Description>
        Importing your data to recover your account is an automated <br />
        process that only takes a few minutes. Provide access to your <br />
        AWS tokens below for Blox to complete this step
      </Description>
      <PasswordInputsWrapper>
        <PasswordInput name={'accessKeyId'} title={'Access Key ID'} autoFocus
          onChange={setAccessKeyId} value={accessKeyId} isDisabled={isPasswordInputDisabled}
        />
        <PasswordInput name={'secretAccessKey'} title={'Secret Access Key'} width={'320px'}
          onChange={setSecretAccessKey} value={secretAccessKey} isDisabled={isPasswordInputDisabled}
        />
      </PasswordInputsWrapper>
      <ButtonWrapper>
        <Button onClick={() => !isButtonDisabled && onButtonClick()} isDisabled={isButtonDisabled}>Continue</Button>
        {isValidLoading && (
          <LoadingWrapper>
            <Spinner width={'17px'} />
            <Message>Validating AWS keys...</Message>
          </LoadingWrapper>
        )}
        {isValidError && (
          <Message error={isValidError}>Please check your access keys and try again</Message>
        )}
      </ButtonWrapper>
    </ModalTemplate>
  );
};

const mapStateToProps = (state) => ({
  areAwsKeyvsValid: keyvaultSelectors.getAwsKeysValidStatus(state),
  isValidLoading: keyvaultSelectors.getIsLoading(state),
  isValidError: keyvaultSelectors.getError(state),
});

const mapDispatchToProps = (dispatch) => ({
  keyvaultActions: bindActionCreators(actionsFromKeyvault, dispatch),
});

type Props = {
  areAwsKeyvsValid: boolean;
  isValidLoading: boolean;
  isValidError: string;
  keyvaultActions: Record<string, any>;
  onClick: () => void;
  onClose: () => void;
};

export default connect(mapStateToProps, mapDispatchToProps)(Step1Modal);
