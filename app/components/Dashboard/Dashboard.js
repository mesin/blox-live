import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { KeyVaultReactivation, KeyVaultUpdate, DepositInfoModal } from '..';
import { PasswordModal } from '../KeyVaultModals/Modals';
import { Wallet, Validators } from './components';
import { summarizeAccounts, normalizeAccountsData } from './service';
import * as actionsFromDashboard from './actions';
import * as actionsFromWizard from '../Wizard/actions';
import * as actionsFromAccounts from '../Accounts/actions';

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
  // TODO: remove the loading of wallet, wallet last version and accounts from elsewhere and put it here
  const { walletStatus, accounts, dashboardActions, accountsActions, wizardActions, walletNeedsUpdate, showReactivationModal, showUpdateModal,
          depositData, showDepositInfoModal, showAddValidatorModal } = props;
  const { setReactivationModalDisplay, setUpdateModalDisplay, setDepositInfoModalDisplay, setAddValidatorModalDisplay } = dashboardActions;
  const { setAddAnotherAccount } = accountsActions;
  const { setFinishedWizard } = wizardActions;
  const accountsSummary = accounts && summarizeAccounts(accounts);
  const normalizedAccounts = accounts && normalizeAccountsData(accounts);

  const onPasswordModalClick = () => {
    setAddValidatorModalDisplay(false);
    setFinishedWizard(false);
    setAddAnotherAccount(true);
  };

  return (
    <Wrapper>
      <Wallet isActive={walletStatus === 'active'} walletNeedsUpdate={walletNeedsUpdate} summary={accountsSummary} />
      <Validators accounts={normalizedAccounts} />
      {showReactivationModal && <KeyVaultReactivation onClose={() => setReactivationModalDisplay(false)} />}
      {showUpdateModal && <KeyVaultUpdate onClose={() => setUpdateModalDisplay(false)} />}
      {!!depositData && showDepositInfoModal && (
        <DepositInfoModal depositData={depositData} onClose={() => setDepositInfoModalDisplay(false)} />
      )}
      {showAddValidatorModal && (
        <PasswordModal onClick={onPasswordModalClick} onClose={() => setAddValidatorModalDisplay(false)} />
      )}
    </Wrapper>
  );
};

const mapStateToProps = (state) => ({
  showReactivationModal: selectors.getReactivationModalDisplayStatus(state),
  showUpdateModal: selectors.getUpdateModalDisplayStatus(state),
  showDepositInfoModal: selectors.getDepositInfoModalDisplayStatus(state),
  showAddValidatorModal: selectors.getValidatorModalDisplayStatus(state),
  depositData: getDepositData(state),
});

const mapDispatchToProps = (dispatch) => ({
  dashboardActions: bindActionCreators(actionsFromDashboard, dispatch),
  accountsActions: bindActionCreators(actionsFromAccounts, dispatch),
  wizardActions: bindActionCreators(actionsFromWizard, dispatch),
});

Dashboard.propTypes = {
  walletNeedsUpdate: PropTypes.bool,
  walletStatus: PropTypes.string,
  accounts: PropTypes.array,
  dashboardActions: PropTypes.object,
  accountsActions: PropTypes.object,
  wizardActions: PropTypes.object,
  showReactivationModal: PropTypes.bool,
  showUpdateModal: PropTypes.bool,
  showDepositInfoModal: PropTypes.bool,
  showAddValidatorModal: PropTypes.bool,
  depositData: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
