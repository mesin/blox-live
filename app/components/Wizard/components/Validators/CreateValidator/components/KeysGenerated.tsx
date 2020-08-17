import React from 'react';
import styled from 'styled-components';
import { Title, SubTitle, Paragraph, BigButton, SuccessIcon } from '../../../common';

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

const KeysGenerated = (props: Props) => {
  const { onClick, validatorData } = props;
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
      <BigButton onClick={onClick}>
        Continue to Staking Deposit
      </BigButton>
    </Wrapper>
  );
};

type Props = {
  onClick: () => void;
  validatorData: Record<string, any>;
};

export default KeysGenerated;
