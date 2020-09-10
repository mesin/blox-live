import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { KeyVaultReactivation, KeyVaultUpdate, DepositInfoModal } from '../../..';
import { PasswordModal } from '../../../KeyVaultModals/Modals';
import * as actionsFromDashboard from '../../actions';
import * as actionsFromWizard from '../../../Wizard/actions';
import * as actionsFromAccounts from '../../../Accounts/actions';

import * as selectors from '../../selectors';
import { getDepositData } from '../../../Wizard/selectors';

import { MODAL_TYPES } from '../../constants';

const Dashboard = (props: Props) => {
  const { dashboardActions, accountsActions, wizardActions, showModal, modalType, depositData } = props;
  const { setModalDisplay } = dashboardActions;
  const { setAddAnotherAccount } = accountsActions;
  const { setFinishedWizard } = wizardActions;

  const onPasswordModalClick = () => {
    setFinishedWizard(false);
    setAddAnotherAccount(true);
  };

  const hideModal = () => setModalDisplay({ show: false, type: '', text: '', });

  if (showModal) {
    switch (modalType) {
      case MODAL_TYPES.REACTIVATION:
        return <KeyVaultReactivation onClose={() => hideModal()} />;
      case MODAL_TYPES.UPDATE:
        return <KeyVaultUpdate onClose={() => hideModal()} />;
      case MODAL_TYPES.DEPOSIT_INFO:
        if (depositData) {
          return <DepositInfoModal depositData={depositData} onClose={() => hideModal()} />;
        }
        return null;
      case MODAL_TYPES.ADD_VALIDATOR:
        return <PasswordModal onClick={onPasswordModalClick} onClose={() => hideModal()} />;
      default:
        return null;
    }
  }
  return null;
};

const mapStateToProps = (state) => ({
  showModal: selectors.getModalDisplayStatus(state),
  modalType: selectors.getModalType(state),
  modalText: selectors.getModalText(state),
  depositData: getDepositData(state),
});

const mapDispatchToProps = (dispatch) => ({
  dashboardActions: bindActionCreators(actionsFromDashboard, dispatch),
  accountsActions: bindActionCreators(actionsFromAccounts, dispatch),
  wizardActions: bindActionCreators(actionsFromWizard, dispatch),
});

type Props = {
  dashboardActions: Record<string, any>;
  accountsActions: Record<string, any>;
  wizardActions: Record<string, any>;
  showModal: boolean;
  modalType: string;
  depositData: string;
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
