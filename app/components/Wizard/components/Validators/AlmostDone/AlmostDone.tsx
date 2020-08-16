import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { setFinishedWizard, loadWallet } from '../../../actions';

import { loadAccounts } from '../../../../Accounts/actions';
import { Title, Paragraph, BigButton } from '../../common';

const Wrapper = styled.div``;

const AlmostDone = (props: Props) => { // TODO: remove this page
  const { callSetFinishedWizard, callLoadWallet, callLoadAccounts } = props;

  const onClick = () => {
    callLoadWallet();
    callLoadAccounts();
    callSetFinishedWizard(true);
  };

  return (
    <Wrapper>
      <Title>You’re almost done!</Title>
      <Paragraph>
        Sit back and relax, we can take it from here. <br />
        Approving your validator can take some time. Please note that this can{' '}
        <br />
        sometimes take between 4-24 hours.
      </Paragraph>
      <Paragraph>
        You will receive an email notification once your Testnet validator is
        approved. <br />
        The moment of approval will activate your validator to start staking.
      </Paragraph>
      <br /> <br />
      <BigButton onClick={onClick}>Continue to Dashboard</BigButton>
    </Wrapper>
  );
};

type Props = {
  callSetFinishedWizard: (status: boolean) => void;
  callLoadWallet: () => void;
  callLoadAccounts: () => void;
};

const mapDispatchToProps = (dispatch) => ({
  callSetFinishedWizard: (status) => dispatch(setFinishedWizard(status)),
  callLoadWallet: () => dispatch(loadWallet()),
  callLoadAccounts: () => dispatch(loadAccounts()),
});

export default connect(null, mapDispatchToProps)(AlmostDone);
