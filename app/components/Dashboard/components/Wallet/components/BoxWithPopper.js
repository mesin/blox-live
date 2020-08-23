import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Box from './Box';
import ReactivatePopper from './ReactivatePopper';
import UpdatePopper from './UpdatePopper';

const Wrapper = styled.div`
  position:relative;
  height:100%;
`;

const BoxWithTooltip = (props) => {
  const { isActive, walletVersion, width, color, bigText, medText, tinyText, image,
          setReactivationModalDisplay, setUpdateModalDisplay
        } = props;
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

  return ( // TODO: add !isActive to line no 35 and compare the walletVersion
    <Wrapper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Box width={width} color={color} bigText={bigText}
        medText={medText} tinyText={tinyText} image={image}
      />
      {showReactivationPopper && (
        <ReactivatePopper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={setReactivationModalDisplay} />
      )}
      {showUpdatePopper && (
        <UpdatePopper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={setUpdateModalDisplay} />
      )}
    </Wrapper>
  );
};

BoxWithTooltip.propTypes = {
  isActive: PropTypes.bool,
  walletVersion: PropTypes.string,
  width: PropTypes.string,
  color: PropTypes.string,
  bigText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  medText: PropTypes.string,
  tinyText: PropTypes.string,
  image: PropTypes.string,
  setReactivationModalDisplay: PropTypes.func,
  setUpdateModalDisplay: PropTypes.func,
};

export default BoxWithTooltip;
