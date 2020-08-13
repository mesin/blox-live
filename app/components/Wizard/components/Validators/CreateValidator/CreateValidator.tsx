import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { useInjectSaga } from 'utils/injectSaga';
import * as currentActions from '../../../../ProcessRunner/actions';
import * as selectors from '../../../../ProcessRunner/selectors';
import saga from '../../../../ProcessRunner/saga';
import { loadDepositData } from '../../../actions';

import { Title, Paragraph, BigButton, Link, Connection } from '../../common';

const key = 'processRunner';

const Wrapper = styled.div``;

const ButtonWrapper = styled.div`
  margin-bottom: 12px;
`;

const CreateValidator = (props: Props) => {
  const { page, setPage, actions, isLoading, message, validatorData, callLoadDepositData } = props;
  const { processSubscribe } = actions;

  useInjectSaga({ key, saga, mode: '' });

  useEffect(() => {
    if (!isLoading && validatorData) {
      callLoadDepositData();
      setPage(page + 1);
    }
  }, [isLoading, validatorData]);

  const onButtonClick = () => {
    processSubscribe('createAccount', 'Generating Validator Keys...');
  };

  return (
    <Wrapper>
      <Title>Create TestNet Validator</Title>
      <Paragraph>
        Now we must generate your secure validator keys to begin creating your{' '}
        <br />
        Testnet validator. These keys will be generated securely using KeyVault.{' '}
        <br />
        <Link href="/">What is a validator key?</Link>
      </Paragraph>
      <ButtonWrapper>
        <BigButton onClick={onButtonClick}>
          Generate Validator Keys
        </BigButton>
      </ButtonWrapper>
      {isLoading && <Connection text={message} />}
    </Wrapper>
  );
};

const mapStateToProps = (state: State) => ({
  isLoading: selectors.getIsLoading(state),
  validatorData: selectors.getData(state),
  message: selectors.getMessage(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(currentActions, dispatch),
  callLoadDepositData: () => dispatch(loadDepositData()),
});

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  isLoading: boolean;
  actions: Record<string, any>;
  validatorData: Record<string, any> | null;
  message: string;
  callLoadDepositData: () => void;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(CreateValidator);
