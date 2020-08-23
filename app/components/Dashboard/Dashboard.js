import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import KeyVaultReactivation from '../KeyVaultReactivation';
import KeyVaultUpdate from '../KeyVaultUpdate';
import { Wallet, Validators } from './components';
import { summarizeAccounts, normalizeAccountsData } from './service';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 70px);
  background-color: ${({ theme }) => theme.gray50};
  display: flex;
  flex-direction: column;
  padding: 44px 94px;
`;

const Dashboard = (props) => {
  const { walletStatus, accounts, walletVersion } = props;
  const [showReactivationModal, setReactivationModalDisplay] = useState(false);
  const [showUpdateModal, setUpdateModalDisplay] = useState(false);
  const accountsSummary = accounts && summarizeAccounts(accounts);
  const normalizedAccounts = accounts && normalizeAccountsData(accounts);
  return (
    <Wrapper>
      <Wallet isActive={walletStatus === 'active'} walletVersion={walletVersion} summary={accountsSummary}
        setReactivationModalDisplay={setReactivationModalDisplay}
        setUpdateModalDisplay={setUpdateModalDisplay}
      />
      <Validators accounts={normalizedAccounts} />
      {showReactivationModal && <KeyVaultReactivation onClose={() => setReactivationModalDisplay(false)} />}
      {showUpdateModal && <KeyVaultUpdate onClose={() => setUpdateModalDisplay(false)} />}
    </Wrapper>
  );
};

Dashboard.propTypes = {
  walletVersion: PropTypes.string,
  walletStatus: PropTypes.string,
  accounts: PropTypes.array,
};

export default Dashboard;
