import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { InfoWithTooltip } from 'common/components';
import { Title, Paragraph, Link, BigButton } from '../../common';
import { updateAccountStatus, setFinishedWizard, loadWallet } from '../../../actions';
import { loadAccounts } from '../../../../Accounts/actions';
import * as selectors from '../../../selectors';
import { getData } from '../../../../ProcessRunner/selectors';
import { DepositData } from './components';

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

let toolTipText = 'GoETH are test tokens needed in order to participate in the Goerli Test Network.';
toolTipText += 'You need at least 32 GoETH test tokens in order to stake on TestNet. GoETH have no real value!';

const StakingDeposit = (props: Props) => {
  const { setPage, page, depositData, accountData,
          callUpdateAccountStatus, callLoadWallet, callLoadAccounts, callSetFinishedWizard,
        } = props;

  const onButtonClick = async () => {
    await callLoadWallet();
    await callLoadAccounts();
    await callSetFinishedWizard(true);
    await setPage(page + 1);
  };

  const onMadeDepositButtonClick = async () => {
    await callUpdateAccountStatus(accountData.id);
    await onButtonClick();
  };

  const onDepositLaterButtonClick = async () => {
    await onButtonClick();
  };

  return (
    <Wrapper>
      <Title>TestNet Staking Deposit</Title>
      <Paragraph>
        To start staking on our Testnet, you are required to stake 32 GoEth
        <InfoWithTooltip title={toolTipText} placement="bottom" /> into the
        <br />
        validator deposit contract. The Blox test network uses the Goerli
        network to <br />
        simulate validator deposits on the proof-of-work enabled Beacon-chain.
        <GoEthButton href={'https://discord.gg/Kw5eFh'} target={'_blank'}>Need GoETH?</GoEthButton>
      </Paragraph>

      {depositData && <DepositData depositData={depositData} />}
      <Link href={'https://www.bloxstaking.com/blox-guide-how-do-i-submit-my-staking-deposit'}>
        Need help?
      </Link>
      <ButtonsWrapper>
        <BigButton onClick={onMadeDepositButtonClick}>I&apos;ve Made the Deposit</BigButton>
        <CancelButton onClick={onDepositLaterButtonClick}>I&apos;ll Deposit Later</CancelButton>
      </ButtonsWrapper>
    </Wrapper>
  );
};

const mapStateToProps = (state: State) => ({
  isLoading: selectors.getIsLoading(state),
  depositData: selectors.getDepositData(state),
  accountData: getData(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  callUpdateAccountStatus: (accountId: string) => dispatch(updateAccountStatus(accountId)),
  callSetFinishedWizard: (status) => dispatch(setFinishedWizard(status)),
  callLoadWallet: () => dispatch(loadWallet()),
  callLoadAccounts: () => dispatch(loadAccounts()),
});

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  isLoading: boolean;
  depositData: Record<string, any> | null;
  accountData: Record<string, any> | null;
  callUpdateAccountStatus: (accountId: string) => void;
  callSetFinishedWizard: (status: boolean) => void;
  callLoadWallet: () => void;
  callLoadAccounts: () => void;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(StakingDeposit);
