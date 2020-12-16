import React, {useState, useEffect} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {notification} from 'antd';
import {NETWORKS} from '../constants';
import {Title, Link, BigButton} from '../../common';
import * as wizardActions from '../../../actions';
import * as selectors from '../../../selectors';

import {clearAccountsData, setDepositNeeded, } from '../../../../Accounts/actions';
import {
  getAccounts, getDepositNeededStatus, getDepositToPublicKey,
  getDepositToIndex, getDepositToNetwork
} from '../../../../Accounts/selectors';

import {getData} from '../../../../ProcessRunner/selectors';

import {MainNetText, TestNetText} from './components';

import theme from "../../../../../theme";
import MoveToBrowserModal from "./components/MoveToBrowserModal";
import {openExternalLink} from "../../../../common/service";
import config from "../../../../../backend/common/config";

const Wrapper = styled.div`
  width:580px;
`;

const SubTitle = styled.div`
  font-size: 16px;
  font-weight: 28px;
  color: ${({theme}) => theme.gray800};
  margin-top: 24px;
`;

const SmallText = styled.div`
  font-size: 12px;
  font-weight: 500px;
  color: ${({theme}) => theme.gray600};
  margin-top: 12px;
`;

const ButtonsWrapper = styled.div`
  width:100%;
  margin-top:12px;
  display:flex;
  justify-content:space-between;
`;

const StakingDeposit = (props: Props) => {
  const {
    setPage, page, depositData, accountsFromApi, actions, callClearAccountsData, accountDataFromProcess,
    isDepositNeeded, publicKey, callSetDepositNeeded, accountIndex, network
  } = props;
  const {updateAccountStatus, clearWizardData, loadDepositData, setFinishedWizard} = actions;

  useEffect(() => {
    if (isDepositNeeded && publicKey) {
      loadDepositData(publicKey, accountIndex, network);
      callSetDepositNeeded({isNeeded: false, publicKey, accountIndex, network});
    }
  }, [isDepositNeeded, publicKey]);

  const [showMoveToBrowserModal, setShowMoveToBrowserModal] = React.useState(false);

  const onMadeDepositButtonClick = async () => {
    setShowMoveToBrowserModal(true)
  /*  const accountFromApi: Record<string, any> = accountsFromApi.find(
      (account) => (account.publicKey === publicKey && account.network === network)
    );
    const currentAccount = accountDataFromProcess || accountFromApi;
    if (currentAccount) {
      await setPage(page + 1);
      await updateAccountStatus(currentAccount.id);
      await callSetDepositNeeded({isNeeded: false, publicKey: '', accountIndex: -1, network: ''});
    } else {
      notification.error({message: 'Account not found'});
    }*/
  };

  const onDepositLaterButtonClick = () => {
    callClearAccountsData();
    clearWizardData();
    setFinishedWizard(true);
  };

  const onCopy = () => notification.success({message: 'Copied to clipboard!'});

  const openDepositBrowser = () => {
    const {depositTo} = depositData;
    openExternalLink('', `${config.env.DEPOSIT_URL}?network=${NETWORKS[network].metaMaskId}&public_key=${publicKey}&deposit_to=${depositTo}`)
  };

  if (network) {
    return (
      <Wrapper>
        <Title>{NETWORKS[network].name} Staking Deposit</Title>
        <SubTitle>To Start Staking, you&apos;ll need to make 2 deposits:</SubTitle>
        {NETWORKS[network].label === NETWORKS.pyrmont.label ? <TestNetText publicKey={publicKey} onCopy={onCopy}/> : <MainNetText publicKey={publicKey} onCopy={onCopy}/>}
        <SmallText>Total: 32.5 ETH + gas fees</SmallText>
        <SmallText style={{'fontSize': '14px', 'color': theme['gray800'], 'marginTop': '34px'}}>You will be transferred to a secured Blox webpage</SmallText>
        <ButtonsWrapper>
          <BigButton onClick={onMadeDepositButtonClick}>Continue to Web Deposit</BigButton>
        </ButtonsWrapper>
        {showMoveToBrowserModal && <MoveToBrowserModal onClose={() => setShowMoveToBrowserModal(false)} onMoveToBrowser={openDepositBrowser}/>}
      </Wrapper>
    );
  }
  return null;
};

const mapStateToProps = (state: State) => ({
  depositData: selectors.getDepositData(state),
  accountDataFromProcess: getData(state),
  accountsFromApi: getAccounts(state),
  isDepositNeeded: getDepositNeededStatus(state),
  publicKey: getDepositToPublicKey(state),
  accountIndex: getDepositToIndex(state),
  network: getDepositToNetwork(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(wizardActions, dispatch),
  callClearAccountsData: () => dispatch(clearAccountsData()),
  callSetDepositNeeded: (payload: DepositNeededPayload) => dispatch(setDepositNeeded(payload)),
});

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  depositData: Record<string, any>;
  accountsFromApi: { publicKey: string, id: number, network: string }[];
  accountDataFromProcess: Record<string, any> | null;
  actions: Record<string, any> | null;
  callClearAccountsData: () => void;
  callSetDepositNeeded: (payload: DepositNeededPayload) => void;
  isDepositNeeded: boolean;
  publicKey: string;
  accountIndex: number;
  network: string;
};

type DepositNeededPayload = {
  isNeeded: boolean;
  publicKey: string;
  accountIndex: number;
  network: string;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(StakingDeposit);
