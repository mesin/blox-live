import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Box from './Box';
import Popper from './Popper';

const Wrapper = styled.div`
  position:relative;
  height:100%;
`;

const BoxWithTooltip = (props) => {
  const { isActive, width, color, bigText, medText, tinyText, image, setReactivationModalDisplay } = props;
  const [showPopper, setPopperDisplay] = React.useState(false);

  const onMouseEnter = () => {
    setPopperDisplay(true);
  };

  const onMouseLeave = () => {
    setPopperDisplay(false);
  };

  return (
    <Wrapper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Box
        width={width}
        color={color}
        bigText={bigText}
        medText={medText}
        tinyText={tinyText}
        image={image}
      />
      {isActive && showPopper && <Popper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={setReactivationModalDisplay} />}
    </Wrapper>
  );
}

BoxWithTooltip.propTypes = {
  isActive: PropTypes.bool,
  width: PropTypes.string,
  color: PropTypes.string,
  bigText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  medText: PropTypes.string,
  tinyText: PropTypes.string,
  image: PropTypes.string,
  setReactivationModalDisplay: PropTypes.func,
};

export default BoxWithTooltip;
