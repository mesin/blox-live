import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import * as currentActions from '../../../actions';
import * as selectors from '../../../selectors';
import { Title, Paragraph, SmallButton, Link, Connection } from '../../common';

const Wrapper = styled.div``;

const ButtonWrapper = styled.div`
  margin-bottom: 12px;
`;

const CreateValidator = (props: Props) => {
  const { page, setPage, actions, isLoading, publicKey } = props;
  const { generateValidatorKey } = actions;

  useEffect(() => {
    if (!isLoading && publicKey) {
      setPage(page + 1);
    }
  }, [isLoading, publicKey]);

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
        <SmallButton onClick={() => generateValidatorKey()}>
          Generate Validator Keys
        </SmallButton>
      </ButtonWrapper>
      {isLoading && <Connection text="Generating Validator Keys..." />}
    </Wrapper>
  );
};

const mapStateToProps = (state: State) => ({
  isLoading: selectors.getIsLoading(state),
  publicKey: selectors.getPublicKey(state),
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
  publicKey: string;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(CreateValidator);
