import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { useInjectSaga } from 'utils/injectSaga';

import * as actionsFromDashboard from '../../../Dashboard/actions';
import { MODAL_TYPES } from '../../../Dashboard/constants';

import * as wizardActions from '../../actions';
import * as wizardSelectors from '../../selectors';
import saga from '../../saga';
import usePasswordHandler from '../../../PasswordHandler/usePasswordHandler';

import * as accountSelectors from '../../../Accounts/selectors';
import { allAccountsDeposited } from '../../../Accounts/service';

import { InfoWithTooltip } from 'common/components';
import ButtonWithIcon from './ButtonWithIcon';

import Store from '../../../../backend/common/store-manager/store';

import bgImage from 'assets/images/bg_staking.jpg';
import keyVaultImg from 'components/Wizard/assets/img-key-vault.svg';
import mainNetImg from 'components/Wizard/assets/img-validator-main-net.svg';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const Left = styled.div`
  width: 45vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${bgImage});
  background-size: cover;
  color: ${({ theme }) => theme.gray50};
  font-size: 54px;
  font-weight: 500;
  line-height: 76px
  text-align: center;
`;

const Right = styled.div`
  width: 55vw;
  height: 100%;
  padding: 100px 11vw 0px 11vw;
`;

const IntroText = styled.div`
  color: ${({ theme }) => theme.gray600};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
`;

let toolTipText = "Blox KeyVault is responsible for securing your private keys and signing the validators'";
toolTipText += 'activity on the beaconChain. Blox will communicate with your secured KeyVault everyime a validator';
toolTipText += 'is requested to attest/propose, and to do so, the KeyVault must be online 24/7.';

const key = 'wizard';

const WelcomePage = (props: Props) => {
  const { setPage, setStep, step, actions, dashboardActions, wallet, accounts, isLoading, isDepositNeeded, addAnotherAccount } = props;
  const { loadWallet, setFinishedWizard } = actions;
  const { setModalDisplay } = dashboardActions;

  const { checkIfPasswordIsNeeded } = usePasswordHandler();
  useInjectSaga({ key, saga, mode: '' });
  const [showStep2, setStep2Status] = useState(false);

  useEffect(() => {
    if (!isLoading && !wallet) {
      loadWallet();
    }
    const store: Store = Store.getStore();
    const hasWallet = wallet && (wallet.status === 'active' || wallet.status === 'offline');
    const hasSeed = store.exists('seed');

    if (hasWallet) {
      if (hasSeed) {
        if (addAnotherAccount) {
          redirectToCreateAccount();
          return;
        }
        if (!allAccountsDeposited(accounts)) {
          if (isDepositNeeded) {
            redirectToDepositPage();
            return;
          }
          setFinishedWizard(true);
          return;
        }
        setStep2Status(true);
        return;
      }
      redirectToPassPhrasePage();
    }
  }, [isLoading]);

  const onStep1Click = () => !showStep2 && setPage(1);

  const onStep2Click = () => {
    if (wallet.status === 'offline') {
      const onSuccess = () => setModalDisplay({ show: true, type: MODAL_TYPES.REACTIVATION, text: ''});
      checkIfPasswordIsNeeded(onSuccess);
    }
    else if (wallet.status === 'active') {
      redirectToCreateAccount();
    }
  };

  const redirectToPassPhrasePage = () => setPage(3);

  const redirectToCreateAccount = () => {
    setStep(step + 1);
    setPage(5);
  };

  const redirectToDepositPage = () => {
    setStep(step + 1);
    setPage(7);
  };

  return (
    <Wrapper>
      <Left>
        Start Your <br />Staking Journey
      </Left>
      <Right>
        <IntroText>
          This one-time wizard will guide you through creating your KeyVault
          <InfoWithTooltip title={toolTipText} placement="bottom" />
          and validator client.
        </IntroText>
        <ButtonWithIcon title="Step 1" subTitle="KeyVault Setup" image={keyVaultImg}
          isDisabled={showStep2} onClick={onStep1Click} isLoading={isLoading}
        />
        <ButtonWithIcon title="Step 2" subTitle="Create A Validator" image={mainNetImg}
          isDisabled={!showStep2} onClick={onStep2Click}
        />
      </Right>
    </Wrapper>
  );
};

const mapStateToProps = (state: State) => ({
  isLoading: wizardSelectors.getIsLoading(state),
  wallet: wizardSelectors.getWallet(state),
  accounts: accountSelectors.getAccounts(state),
  isDepositNeeded: accountSelectors.getDepositNeededStatus(state),
  addAnotherAccount: accountSelectors.getAddAnotherAccount(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(wizardActions, dispatch),
  dashboardActions: bindActionCreators(actionsFromDashboard, dispatch)
});

type Props = {
  setPage: (page: number) => void;
  setStep: (step: number) => void;
  step: number;
  actions: Record<string, any>;
  dashboardActions: Record<string, any>;
  wallet: Record<string, any>;
  accounts: [];
  isLoading: boolean;
  isDepositNeeded: boolean;
  addAnotherAccount: boolean;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
