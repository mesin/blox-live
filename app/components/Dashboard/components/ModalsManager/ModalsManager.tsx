import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { KeyVaultReactivation, KeyVaultUpdate, DepositInfoModal } from '../../..';
import { PasswordModal } from '../../../KeyVaultModals/Modals';
import ActiveValidatorModal from '../../../ActiveValidatorModal';
import * as actionsFromDashboard from '../../actions';

import * as selectors from '../../selectors';
import { getActiveValidators } from '../../../EventLogs/selectors';

import { MODAL_TYPES } from '../../constants';

const ModalsManager = (props: Props) => {
  const { dashboardActions, showModal, modalType, onSuccess, activeValidators } = props;
  const { clearModalDisplayData } = dashboardActions;

  const onPasswordModalSuccess = () => {
    onSuccess();
    clearModalDisplayData();
  };

  if (showModal) {
    switch (modalType) {
      case MODAL_TYPES.PASSWORD:
        return <PasswordModal onClick={onPasswordModalSuccess} onClose={() => clearModalDisplayData()} />;
      case MODAL_TYPES.REACTIVATION:
        return <KeyVaultReactivation onClose={() => clearModalDisplayData()} />;
      case MODAL_TYPES.UPDATE:
        return <KeyVaultUpdate onClose={() => clearModalDisplayData()} />;
      case MODAL_TYPES.DEPOSIT_INFO:
        return <DepositInfoModal onClose={() => clearModalDisplayData()} />;
      case MODAL_TYPES.ACTIVE_VALIDATOR:
        return activeValidators.length > 0 && <ActiveValidatorModal onClose={() => clearModalDisplayData()} activeValidators={activeValidators} />;
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
  onSuccess: selectors.getModalOnSuccess(state),
  activeValidators: getActiveValidators(state),
});

const mapDispatchToProps = (dispatch) => ({
  dashboardActions: bindActionCreators(actionsFromDashboard, dispatch),
});

type Props = {
  dashboardActions: Record<string, any>;
  showModal: boolean;
  modalType: string;
  onSuccess: () => void;
  activeValidators: [{ publicKey: string }],
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalsManager);
