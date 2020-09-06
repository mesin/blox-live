import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Lottie from 'lottie-web-react';
import { SuccessIcon } from 'common/components';
import { Title, Paragraph, BigButton } from '../../common';
import * as actionsFromWizard from '../../../actions';
import * as actionsFromAccounts from '../../../../Accounts/actions';

import animationData from 'assets/animations/confetti.json';

const Wrapper = styled.div`
  position: relative;
  z-index: 2;
`;

const Confetti = styled.div`
  position: absolute;
  top: -65px;
  z-index: 2;
  width: 100%;
`;

const defaultOptions = {
  name: 'confetti',
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
};

const confettiArray = [{ speed: 0.5 }, { speed: 0.6 }, { speed: 0.7 }];

const CongratulationPage = (props: Props) => {
  const { wizardActions, accountsActions } = props;
  const { clearAccountsData } = accountsActions;
  const { setFinishedWizard, clearWizardData } = wizardActions;

  const onClick = async () => {
    await clearAccountsData();
    await clearWizardData();
    await setFinishedWizard(true);
  };

  return (
    <>
      {confettiArray.map((confetti, index) => (
        <Confetti key={index}>
          <Lottie
            options={defaultOptions}
            playingState="play"
            speed={confetti.speed}
          />
        </Confetti>
      ))}
      <Wrapper>
        <SuccessIcon />
        <Title color="accent2400">Validator created successfully!</Title>
        <Paragraph>
          Approving your validator can sometime take between 4 to 24 hours. We will <br />
          notify you via email once your validator is approved and is actively staking on <br />
          the ETH 2 network. <br /> <br />

          Meanwhile, let&apos;s visit the dashboard.
        </Paragraph>
        <BigButton onClick={() => onClick()}>Continue to Dashboard</BigButton>
      </Wrapper>
    </>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  wizardActions: bindActionCreators(actionsFromWizard, dispatch),
  accountsActions: bindActionCreators(actionsFromAccounts, dispatch),
});

type Props = {
  page: number;
  setPage: (page: number) => void;
  wizardActions: Record<string, any>;
  accountsActions: Record<string, any>;
};

type Dispatch = (arg0: { type: string }) => any;

export default connect(null, mapDispatchToProps)(CongratulationPage);
