import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Box from './Box';
import ReactivatePopper from './ReactivatePopper';
import UpdatePopper from './UpdatePopper';
import * as dashboardActions from '../../../actions';
import { MODAL_TYPES } from '../../../constants';
import usePasswordHandler from '../../../../PasswordHandler/usePasswordHandler';

const Wrapper = styled.div`
  position:relative;
  height:100%;
`;

const BoxWithTooltip = (props) => {
  const { isActive, walletNeedsUpdate, width, color, bigText, medText, tinyText, image, actions } = props;
  const { setModalDisplay } = actions;
  const { checkIfPasswordIsNeeded } = usePasswordHandler();

  const showReactivationModal = () => {
    const onSuccess = () => setModalDisplay({ show: true, type: MODAL_TYPES.REACTIVATION });
    checkIfPasswordIsNeeded(onSuccess);
  };

  const showUpdateModal = () => {
    const onSuccess = () => setModalDisplay({ show: true, type: MODAL_TYPES.UPDATE });
    checkIfPasswordIsNeeded(onSuccess);
  };

  return (
    <Wrapper>
      <Box width={width} color={color} bigText={bigText}
        medText={medText} tinyText={tinyText} image={image}
      />
      {!isActive && (
        <ReactivatePopper onClick={showReactivationModal} />
      )}
      {walletNeedsUpdate && isActive && (
        <UpdatePopper onClick={showUpdateModal} />
      )}
    </Wrapper>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(dashboardActions, dispatch),
});

BoxWithTooltip.propTypes = {
  isActive: PropTypes.bool,
  walletNeedsUpdate: PropTypes.bool,
  width: PropTypes.string,
  color: PropTypes.string,
  bigText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  medText: PropTypes.string,
  tinyText: PropTypes.string,
  image: PropTypes.string,
  actions: PropTypes.object,
};

export default connect(null, mapDispatchToProps)(BoxWithTooltip);
