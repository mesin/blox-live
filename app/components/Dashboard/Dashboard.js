import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Wallet, Validators, ModalsManager } from './components';
import { summarizeAccounts, normalizeAccountsData } from './service';
import EventLogs from './components/EventLogs';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 70px);
  background-color: ${({ theme }) => theme.gray50};
  display: flex;
  flex-direction: column;
  padding: 44px 94px;
`;

const Dashboard = (props) => {
  const { walletStatus, accounts, eventLogs, walletNeedsUpdate } = props;
  const accountsSummary = accounts && summarizeAccounts(accounts);
  const normalizedAccounts = accounts && normalizeAccountsData(accounts);

  return (
    <Wrapper>
      <Wallet isActive={walletStatus === 'active'} walletNeedsUpdate={walletNeedsUpdate} summary={accountsSummary} />
      <Validators accounts={normalizedAccounts} />
      <EventLogs events={eventLogs} />
      <ModalsManager />
    </Wrapper>
  );
};

Dashboard.propTypes = {
  walletNeedsUpdate: PropTypes.bool,
  walletStatus: PropTypes.string,
  accounts: PropTypes.array,
  eventLogs: PropTypes.array,
};

export default Dashboard;
