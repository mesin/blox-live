import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { notification } from 'antd';
import {
  Title,
  SubTitle,
  Paragraph,
  CopyToClipboard,
  SmallButton,
  SuccessIcon,
} from '../../common';
import * as selectors from '../../../selectors';

const Wrapper = styled.div``;

const CopyToClipboardWrapper = styled.div`
  margin: 10px 0px 15px 0px;
`;

const onCopy = () => notification.success({ message: 'Copied to clipboard!' });

const ValidatorCreated = (props: Props) => {
  const { setPage, page, publicKey } = props;
  return (
    <Wrapper>
      <SuccessIcon />
      <Title color="accent2400">Your Keys Were Created!</Title>
      <Paragraph>
        Your new Testnet validator keys were created and are now secured inside
        your KeyVault.
      </Paragraph>
      <SubTitle>Public Key</SubTitle>
      <CopyToClipboardWrapper>
        <CopyToClipboard onCopy={onCopy} text={publicKey} />
      </CopyToClipboardWrapper>
      <SmallButton onClick={() => setPage(page + 1)}>
        Continue to Staking Deposit
      </SmallButton>
    </Wrapper>
  );
};

type Props = {
  page: number;
  setPage: (page: number) => void;
  step: number;
  setStep: (page: number) => void;
  isLoading: boolean;
  publicKey: string;
};

const mapStateToProps = (state: State) => ({
  isLoading: selectors.getIsLoading(state),
  publicKey: selectors.getPublicKey(state),
});

type State = Record<string, any>;

export default connect(mapStateToProps)(ValidatorCreated);
