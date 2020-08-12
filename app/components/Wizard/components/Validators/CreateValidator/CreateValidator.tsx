import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { useInjectSaga } from 'utils/injectSaga';
import * as currentActions from '../../../../ProcessRunner/actions';
import * as selectors from '../../../../ProcessRunner/selectors';
import saga from '../../../../ProcessRunner/saga';
import { Title, Paragraph, SmallButton, Link, Connection } from '../../common';

const key = 'processRunner';

const Wrapper = styled.div``;

const ButtonWrapper = styled.div`
  margin-bottom: 12px;
`;

const CreateValidator = (props: Props) => {
  const { page, setPage, actions, isLoading, message, validatorData } = props;
  const { processSubscribe } = actions;

  useInjectSaga({ key, saga, mode: '' });

  useEffect(() => {
    if (!isLoading && validatorData) {
      setPage(page + 1);
    }
  }, [isLoading, validatorData]);

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
        <SmallButton onClick={() => processSubscribe('createAccount', 'Generating Validator Keys...')}>
          Generate Validator Keys
        </SmallButton>
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
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(CreateValidator);
