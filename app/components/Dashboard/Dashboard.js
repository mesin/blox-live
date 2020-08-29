import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { KeyVaultReactivation, KeyVaultUpdate, DepositInfoModal } from '..';
import { Wallet, Validators } from './components';
import { summarizeAccounts, normalizeAccountsData } from './service';
import * as dashboardActions from './actions';
import * as selectors from './selectors';
import { getDepositData } from '../Wizard/selectors';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 70px);
  background-color: ${({ theme }) => theme.gray50};
  display: flex;
  flex-direction: column;
  padding: 44px 94px;
`;

const Dashboard = (props) => {
  const { walletStatus, accounts, actions, walletNeedsUpdate, showReactivationModal, showUpdateModal,
          depositData, showDepositInfoModal } = props;
  const { setReactivationModalDisplay, setUpdateModalDisplay, setDepositInfoModalDisplay } = actions;
  const accountsSummary = accounts && summarizeAccounts(accounts);
  const normalizedAccounts = accounts && normalizeAccountsData(accounts);

  return (
    <Wrapper>
      <Wallet isActive={walletStatus === 'active'} walletNeedsUpdate={walletNeedsUpdate} summary={accountsSummary} />
      <Validators accounts={normalizedAccounts} />
      {showReactivationModal && <KeyVaultReactivation onClose={() => setReactivationModalDisplay(false)} />}
      {showUpdateModal && <KeyVaultUpdate onClose={() => setUpdateModalDisplay(false)} />}
      {!!depositData && showDepositInfoModal && (
        <DepositInfoModal depositData={depositData} onClose={() => setDepositInfoModalDisplay(false)} />
      )}
    </Wrapper>
  );
};

const mapStateToProps = (state) => ({
  showReactivationModal: selectors.getReactivationModalDisplayStatus(state),
  showUpdateModal: selectors.getUpdateModalDisplayStatus(state),
  showDepositInfoModal: selectors.getDepositInfoModalDisplayStatus(state),
  depositData: getDepositData(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(dashboardActions, dispatch),
});

Dashboard.propTypes = {
  walletNeedsUpdate: PropTypes.bool,
  walletStatus: PropTypes.string,
  accounts: PropTypes.array,
  actions: PropTypes.object,
  showReactivationModal: PropTypes.bool,
  showUpdateModal: PropTypes.bool,
  showDepositInfoModal: PropTypes.bool,
  depositData: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
