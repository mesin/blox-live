import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Wallet, Validators, Reactivation } from './components';
import { summarizeAccounts, normalizeAccountsData } from './service';
import { Modal } from 'common/components';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 70px);
  background-color: ${({ theme }) => theme.gray50};
  display: flex;
  flex-direction: column;
  padding: 44px 94px;
`;

const Dashboard = (props) => {
  const { walletStatus, accounts } = props;
  const [showReactivationModal, setReactivationModalDisplay] = useState(false);
  const accountsSummary = accounts && summarizeAccounts(accounts);
  const normalizedAccounts = accounts && normalizeAccountsData(accounts);
  return (
    <Wrapper>
      <Wallet isActive={walletStatus === 'active'} summary={accountsSummary} setReactivationModalDisplay={setReactivationModalDisplay} />
      <Validators accounts={normalizedAccounts} />
      {showReactivationModal && <Reactivation onClose={() => setReactivationModalDisplay(false)} />}
    </Wrapper>
  );
};

Dashboard.propTypes = {
  walletStatus: PropTypes.string,
  accounts: PropTypes.array,
};

export default Dashboard;
