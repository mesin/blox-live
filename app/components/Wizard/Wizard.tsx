import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { getWizardFinishedStatus } from './selectors';
import { getAddAnotherAccount } from '../Accounts/selectors';

import Header from '../common/Header';
import ContentManager from './components/ContentManager';
import { DiscordButton } from 'common/components';

const Wrapper = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.gray50};
`;

const Wizard = (props: Props) => {
  const { isFinishedWizard, addAnotherAccount } = props;
  const [step, setStep] = useState(1);
  const [page, setPage] = useState(0);

  const withMenu = !isFinishedWizard && addAnotherAccount && step === 2;

  const contentManagerProps = { page, setPage, step, setStep };

  return (
    <Wrapper>
      <Header withMenu={withMenu} />
      <ContentManager {...contentManagerProps} />
      <DiscordButton />
    </Wrapper>
  );
};

const mapStateToProps = (state) => ({
  isFinishedWizard: getWizardFinishedStatus(state),
  addAnotherAccount: getAddAnotherAccount(state),
});

type Props = {
  isFinishedWizard: boolean;
  addAnotherAccount: boolean;
};

export default connect(mapStateToProps)(Wizard);
