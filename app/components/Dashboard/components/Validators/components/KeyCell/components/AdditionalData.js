import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner } from 'common/components';
import { setDepositInfoModalDisplay } from '../../../../../actions';

import { loadDepositData, setFinishedWizard } from '../../../../../../Wizard/actions';
import { getIsLoading } from '../../../../../../Wizard/selectors';

import { setDepositNeeded } from '../../../../../../Accounts/actions';

import WarningText from './WarningText';
import BlueButton from './BlueButton';
import Date from './Date';

const AdditionalData = (props) => {
  const { publicKey, status, createdAt, callSetDepositInfoModalDisplay,
          callLoadDepositData, callSetFinishedWizard, isLoading, callSetDepositNeeded
        } = props;

  const onDepositInfoButtonClick = async () => {
    await callLoadDepositData(publicKey);
    await callSetDepositInfoModalDisplay(true);
  };

  const onFinishSetupClick = () => {
    callSetDepositNeeded(true);
    callSetFinishedWizard(false);
  };

  if (status === 'pending') {
    return (
      <>
        <WarningText>Waiting for approval</WarningText>
        <BlueButton onClick={() => onDepositInfoButtonClick()}>Deposit Info</BlueButton>
        {isLoading && <Spinner width={'10px'} />}
      </>
    );
  }
  if (status === 'waiting') {
    return (
      <>
        <WarningText>Waiting for deposit</WarningText>
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
  status: PropTypes.string,
  createdAt: PropTypes.string,
  callLoadDepositData: PropTypes.func,
  callSetDepositInfoModalDisplay: PropTypes.func,
  callSetFinishedWizard: PropTypes.func,
  callSetDepositNeeded: PropTypes.func,
  isLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isLoading: getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  callLoadDepositData: (publicKey) => dispatch(loadDepositData(publicKey)),
  callSetDepositInfoModalDisplay: (show) => dispatch(setDepositInfoModalDisplay(show)),
  callSetFinishedWizard: (isFinished) => dispatch(setFinishedWizard(isFinished)),
  callSetDepositNeeded: (depositNeeded) => dispatch(setDepositNeeded(depositNeeded)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdditionalData);
