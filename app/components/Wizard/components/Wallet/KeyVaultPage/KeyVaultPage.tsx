import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { notification } from 'antd';

import { subscribeToEvent } from '../../../../WebSockets/actions';
import { loadWallet } from '../../../actions';
import * as selectors from '../../../selectors';
import * as socketSelectors from '../../../../WebSockets/selectors';

import { BottomLine } from './components';
import { Title, Paragraph, CopyToClipboard } from '../../common';

const Wrapper = styled.div``;

const Link = styled.a`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary900};
  font-family: Avenir;
  &:hover {
    color: ${({ theme }) => theme.primary700};
  }
`;

const KeyVaultPage = (props: Props) => {
  const { page, setPage, isLoadingWallet, otp, command, wallet } = props;
  const onCopy = async () => {
    if (!isLoadingWallet) {
      const { callSubscribeToEvent } = props;
      callSubscribeToEvent('subscribeToWallet', {
        key: 'status',
        value: 'active',
      });
    }
    await notification.success({ message: 'Copied to clipboard!' });
  };

  useEffect(() => {
    if (wallet && wallet.status === 'active') {
      notification.destroy();
      setPage(page + 1);
    }
  }, [isLoadingWallet]);

  const text = `${command} ${otp}`;

  return (
    <Wrapper>
      <Title>Install your staking KeyVault</Title>
      <Paragraph>
        We will now create your KeyVault on your AWS server by running a <br />
        command line inside your Terminal/Postman. To do that KeyVault, Blox
        need <br />
        to have access to a dedicated server it creates for your <br />
        KeyVault on your AWS account. <br />
        To create your secured blox KeyVault on AWS follow{' '}
        <Link href="/">Step-by-Step Guide &gt;</Link>
      </Paragraph>
      <CopyToClipboard onCopy={onCopy} text={text} />
      {isLoadingWallet && <BottomLine />}
    </Wrapper>
  );
};

const mapStateToProps = (state: State) => ({
  otp: selectors.getOneTimePassword(state),
  command: selectors.getCommand(state),
  isLoadingWallet: socketSelectors.getIsLoading(state),
  wallet: socketSelectors.getData(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadWallet: () => dispatch(loadWallet()),
  callSubscribeToEvent: (eventName: string, doneCondition: any) =>
    dispatch(subscribeToEvent(eventName, doneCondition)),
});

type Props = {
  wallet: Record<string, any>;
  isLoadingWallet: boolean;
  page: number;
  setPage: (page: number) => void;
  loadWallet: () => void;
  otp: string;
  command: string;
  callSubscribeToEvent: (
    eventName: string,
    doneCondition: Record<string, any>
  ) => void;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(KeyVaultPage);
