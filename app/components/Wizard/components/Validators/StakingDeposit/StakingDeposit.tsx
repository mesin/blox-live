import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { notification } from 'antd';
import { shell } from 'electron';
import { InfoWithTooltip } from 'common/components';
import { INTRO_TOOLTIP_TEXT, NETWORKS } from '../constants';
import { Title, Paragraph, Link, BigButton } from '../../common';
import * as wizardActions from '../../../actions';
import * as selectors from '../../../selectors';

import { clearAccountsData, setDepositNeeded, } from '../../../../Accounts/actions';
import { getAccounts, getDepositNeededStatus, getDepositToPublicKey,
         getDepositToIndex, getDepositToNetwork } from '../../../../Accounts/selectors';

import { getData } from '../../../../ProcessRunner/selectors';

import { DepositData } from './components';
import { openExternalLink } from '../../../../common/service';
import config from 'backend/common/config';

import tipImage from 'assets/images/info.svg';

const Wrapper = styled.div`
  width:580px;
`;

const GoEthButton = styled.a`
  width:113px;
  height:28px;
  border-radius:6px;
  border:solid 1px ${({theme}) => theme.gray400};
  font-size: 11px;
  font-weight: 500;
  color:${({theme}) => theme.primary900};
  display:flex;
  align-items:center;
  justify-content:center;
  margin-top:12px;
  cursor:pointer;
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

  const onDepositLaterButtonClick = async () => {
    await clearWizardData();
    await setFinishedWizard(true);
    await callClearAccountsData();
  };

  const onCopy = () => notification.success({message: 'Copied to clipboard!'});
  if (network) {
    return (
      <Wrapper>
        <Title>{NETWORKS[network].name} Staking Deposit</Title>
        <Paragraph>
          To start staking on beacon chain {NETWORKS[network].name}, you are required to stake <br />
          32 GoETH<InfoWithTooltip title={INTRO_TOOLTIP_TEXT} placement="bottom" /> into the
          validator deposit contract.
          {network === 'test' && (
            <GoEthButton onClick={() => shell.openExternal(config.env.DISCORD_GOETH_INVITE)}>
              Need GoETH?
            </GoEthButton>
          )}

        </Paragraph>

        {depositData && <DepositData depositData={depositData} onCopy={onCopy} network={network} />}
        <Tip><TipImage src={tipImage} />If your deposit transaction fails, try increasing the Gas Price and Gas Limit.</Tip>
        <Link onClick={() => openExternalLink('docs-guides/#pp-toc__heading-anchor-15')}>Need help?</Link>
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
  depositData: string;
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
