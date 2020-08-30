import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Box from './Box';
import ReactivatePopper from './ReactivatePopper';
import UpdatePopper from './UpdatePopper';
import * as dashboardActions from '../../../actions';
import * as selectors from '../../../selectors';

const Wrapper = styled.div`
  position:relative;
  height:100%;
`;

const BoxWithTooltip = (props) => {
  const { isActive, walletNeedsUpdate, width, color, bigText, medText, tinyText, image, actions } = props;
  const { setReactivationModalDisplay, setUpdateModalDisplay } = actions;
  const [showReactivationPopper, setReactivationPopperDisplay] = React.useState(false);
  const [showUpdatePopper, setUpdatePopperDisplay] = React.useState(false);

  const onMouseEnter = () => {
    setReactivationPopperDisplay(true);
    setUpdatePopperDisplay(true);
  };

  const onMouseLeave = () => {
    setReactivationPopperDisplay(false);
    setUpdatePopperDisplay(false);
  };

  return (
    <Wrapper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Box width={width} color={color} bigText={bigText}
        medText={medText} tinyText={tinyText} image={image}
      />
      {showReactivationPopper && isActive && (
        <ReactivatePopper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={setReactivationModalDisplay} />
      )}
      {showUpdatePopper && walletNeedsUpdate && !isActive && (
        <UpdatePopper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={setUpdateModalDisplay} />
      )}
    </Wrapper>
  );
};

const mapStateToProps = (state) => ({
  showReactivationModal: selectors.getReactivationModalDisplayStatus(state),
  showUpdateModal: selectors.getUpdateModalDisplayStatus(state),
  showDepositInfoModal: selectors.getDepositInfoModalDisplayStatus(state),
});

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

export default connect(mapStateToProps, mapDispatchToProps)(BoxWithTooltip);
