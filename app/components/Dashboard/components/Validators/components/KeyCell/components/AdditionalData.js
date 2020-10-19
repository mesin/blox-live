import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import usePasswordHandler from '../../../../../../PasswordHandler/usePasswordHandler';

import * as actionsFromDashboard from '../../../../../actions';
import * as actionsFromWizard from '../../../../../../Wizard/actions';

import { MODAL_TYPES } from '../../../../../constants';
import { setDepositNeeded } from '../../../../../../Accounts/actions';

import WarningText from './WarningText';
import BlueButton from './BlueButton';
import Date from './Date';

const AdditionalData = (props) => {
  const { publicKey, status, createdAt, dashboardActions, wizardActions,
          accountIndex, callSetDepositNeeded, network } = props;
  const { setModalDisplay } = dashboardActions;
  const { loadDepositData, setFinishedWizard } = wizardActions;

  const { checkIfPasswordIsNeeded } = usePasswordHandler();

  const onDepositInfoButtonClick = () => {
    const onPasswordSuccess = async () => {
      await loadDepositData(publicKey, accountIndex, network);
      await setModalDisplay({ show: true, type: MODAL_TYPES.DEPOSIT_INFO, text: '', });
    };
    checkIfPasswordIsNeeded(onPasswordSuccess);
  };

  const onFinishSetupClick = async () => {
    const onPasswordSuccess = async () => {
      await callSetDepositNeeded({isNeeded: true, publicKey, accountIndex, network});
      await setFinishedWizard(false);
    };
    checkIfPasswordIsNeeded(onPasswordSuccess);
  };

  if (status === 'pending') {
    return (
      <>
        <WarningText>Waiting for approval</WarningText>
        <BlueButton onClick={() => onDepositInfoButtonClick()}>Deposit Info</BlueButton>
      </>
    );
  }
  if (['waiting', 'partially_deposited'].includes(status)) {
    let warningTitle = '';
    if (status === 'waiting') {
      warningTitle = 'Waiting for deposit';
    } else if (status === 'partially_deposited') {
      warningTitle = 'Partial deposited';
    }
    return (
      <>
        <WarningText>{warningTitle}</WarningText>
        <BlueButton onClick={() => onFinishSetupClick()}>Finish Setup</BlueButton>
      </>
    );
  }
  return (
    <Date>Created: {createdAt}</Date>
  );
};

AdditionalData.propTypes = {
  publicKey: PropTypes.string,
  accountIndex: PropTypes.number,
  network: PropTypes.string,
  status: PropTypes.string,
  createdAt: PropTypes.string,
  dashboardActions: PropTypes.object,
  wizardActions: PropTypes.object,
  callSetDepositNeeded: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => ({
  dashboardActions: bindActionCreators(actionsFromDashboard, dispatch),
  wizardActions: bindActionCreators(actionsFromWizard, dispatch),
  callSetDepositNeeded: (payload) => dispatch(setDepositNeeded(payload)),
});

export default connect(null, mapDispatchToProps)(AdditionalData);
