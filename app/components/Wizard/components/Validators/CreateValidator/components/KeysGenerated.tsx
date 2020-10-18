import React from 'react';
import styled from 'styled-components';
import { InfoWithTooltip } from 'common/components';
import { Title, SubTitle, Paragraph, BigButton, SuccessIcon } from '../../../common';
import { NETWORKS } from '../../constants';

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
  padding:16px;
  margin-bottom:16px;
`;

const SmallText = styled.div`
  margin:16px 0px 24px 0px;
  font-size:12px;
`;

let publicKeyTooltip = 'The public (signing) key is used for signing the validator’s on-chain duties,';
publicKeyTooltip += 'including proposing blocks and attesting to others. The validator public key must be online for signing 24/7.';
let withdrawalKeyTooltip = 'The withdrawal public key is used to incorporate data into an Ethereum staking deposit,';
withdrawalKeyTooltip += 'which will later be used for identifying the entity that is allowed to withdraw Ether using the Withdrawal Private Key.';

const KeysGenerated = (props: Props) => { // TODO: handle network name
  const { onClick, validatorData } = props;
  return (
    <Wrapper>
      <SuccessIcon />
      <Title color="accent2400">Your Keys Were Created!</Title>
      <Paragraph>
        Your new {NETWORKS[validatorData.network].name} validator keys were created and are now secured inside <br />
        your KeyVault. Validator will be visible on Etherscan only after deposit.
      </Paragraph>
      <SubTitle>
        Public Key
        <InfoWithTooltip title={publicKeyTooltip} placement="top" />
      </SubTitle>
      <KeyWrapper>{validatorData.publicKey}</KeyWrapper>
      <SubTitle>
        Withdrawal Key
        <InfoWithTooltip title={withdrawalKeyTooltip} placement="top" />
      </SubTitle>
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
