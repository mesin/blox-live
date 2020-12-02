import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { notification } from 'antd';
import { NETWORKS } from '../constants';
import { Title, Link, BigButton } from '../../common';
import * as wizardActions from '../../../actions';
import * as selectors from '../../../selectors';

import { clearAccountsData, setDepositNeeded, } from '../../../../Accounts/actions';
import { getAccounts, getDepositNeededStatus, getDepositToPublicKey,
         getDepositToIndex, getDepositToNetwork } from '../../../../Accounts/selectors';

import { getData } from '../../../../ProcessRunner/selectors';

import { DepositData, MainNetText, TestNetText } from './components';
import { openExternalLink } from '../../../../common/service';

import tipImage from 'assets/images/info.svg';

const Wrapper = styled.div`
  width:580px;
`;

const ButtonsWrapper = styled.div`
  width:100%;
  margin-top:36px;
  display:flex;
  justify-content:space-between;
`;

const CancelButton = styled(BigButton)`
  color:${({theme}) => theme.gray600};
  background-color:transparent;
  border:1px solid ${({theme}) => theme.gray400};
`;

const Tip = styled.div`
  font-size: 12px;
  font-weight: 500;
  display:flex;
  align-items:center;
  margin-top:78px;
  margin-bottom:8px;
`;

const TipImage = styled.img`
  width:24px;
  height:24px;
  margin-right:7px;
`;

const WarningText = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${({theme}) => theme.warning900};
`;

const StakingDeposit = (props: Props) => {
  const { setPage, page, depositData, accountsFromApi, actions, callClearAccountsData, accountDataFromProcess,
          isDepositNeeded, publicKey, callSetDepositNeeded, accountIndex, network } = props;
  const { updateAccountStatus, clearWizardData, loadDepositData, setFinishedWizard } = actions;

  useEffect(() => {
    if (isDepositNeeded && publicKey) {
      loadDepositData(publicKey, accountIndex, network);
      callSetDepositNeeded({isNeeded: false, publicKey, accountIndex, network});
    }
  }, [isDepositNeeded, publicKey]);

  const onMadeDepositButtonClick = async () => {
    const accountFromApi: Record<string, any> = accountsFromApi.find(
      (account) => (account.publicKey === publicKey && account.network === network)
    );
    const currentAccount = accountDataFromProcess || accountFromApi;
    if (currentAccount) {
      await setPage(page + 1);
      await updateAccountStatus(currentAccount.id);
      await callSetDepositNeeded({ isNeeded: false, publicKey: '', accountIndex: -1, network: ''});
    }
    else {
      notification.error({message: 'Account not found'});
    }
  };

  const onDepositLaterButtonClick = () => {
    callClearAccountsData();
    clearWizardData();
    setFinishedWizard(true);
  };

  const onCopy = () => notification.success({message: 'Copied to clipboard!'});
  if (network) {
    const needHelpLink = NETWORKS[network].name === 'Mainnet' ?
     'docs-guides/#pp-toc__heading-anchor-14' :
     'documents/guides/#pp-toc__heading-anchor-20';

    return (
      <Wrapper>
        <Title>{NETWORKS[network].name} Staking Deposit</Title>
        {NETWORKS[network].name === NETWORKS.mainnet.name ? (<MainNetText />) : (<TestNetText />)}
        {depositData && <DepositData depositData={depositData} onCopy={onCopy} network={network} />}
        {NETWORKS[network].name === NETWORKS.pyrmont.name && (
          <WarningText>Make sure you send GoEth testnet tokens and not real ETH!</WarningText>
        )}
        <Tip><TipImage src={tipImage} />If your deposit transaction fails, try increasing the Gas Price and Gas Limit.</Tip>
        <Link onClick={() => openExternalLink(needHelpLink)}>Need help?</Link>
        <ButtonsWrapper>
          <BigButton onClick={onMadeDepositButtonClick}>I&apos;ve Made the Deposit</BigButton>
          <CancelButton onClick={onDepositLaterButtonClick}>I&apos;ll Deposit Later</CancelButton>
        </ButtonsWrapper>
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
