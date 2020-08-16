import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Title, SubTitle, Paragraph, BigButton, SuccessIcon } from '../../common';
import * as selectors from '../../../../ProcessRunner/selectors';

const Wrapper = styled.div``;

const KeyWrapper = styled.div`
  width: 546px;
  border-radius: 8px;
  color: ${({theme}) => theme.gray600};
  font-size: 11px;
  font-weight: 500;
  border: solid 1px ${({theme}) => theme.gray300};
  background-color: ${({theme}) => theme.gray100};
  display:flex;
  align-items:center;
  padding:24px 16px;
  margin-bottom:16px;
`;

const SmallText = styled.div`
  margin:16px 0px 24px 0px;
  font-size:12px;
`;

const ValidatorCreated = (props: Props) => {
  const { setPage, page, validatorData } = props;
  return (
    <Wrapper>
      <SuccessIcon />
      <Title color="accent2400">Your Keys Were Created!</Title>
      <Paragraph>
        Your new Testnet validator keys were created and are now secured inside <br />
        your KeyVault. Validator will be visible on Etherscan only after deposit.
      </Paragraph>
      <SubTitle>Public Key</SubTitle>
      <KeyWrapper>{validatorData.publicKey}</KeyWrapper>
      <SubTitle>Withdrawal Key</SubTitle>
      <KeyWrapper>{validatorData.withdrawalKey}</KeyWrapper>
      <SmallText>
        You can later export your validator keys.
      </SmallText>
      <BigButton onClick={() => setPage(page + 1)}>
        Continue to Staking Deposit
      </BigButton>
    </Wrapper>
  );
};

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  validatorData: Record<string, any>;
};

const mapStateToProps = (state: State) => ({
  validatorData: selectors.getData(state),
});

type State = Record<string, any>;

export default connect(mapStateToProps)(ValidatorCreated);
