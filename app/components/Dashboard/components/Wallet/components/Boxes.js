import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Box from './Box';
import BoxWithPopper from './BoxWithPopper';
import { getBoxes } from './service';

const Wrapper = styled.div`
  width: 100%;
  height: 168px;
  display: flex;
  justify-content: space-between;
`;

const Boxes = (props) => {
  const { isActive, summary, setReactivationModalDisplay } = props;
  const boxes = getBoxes(isActive, summary);
  return (
    <Wrapper>
      {boxes.map((box, index) => {
        const { width, color, bigText, medText, tinyText } = box;
        if (index === boxes.length - 1) {
          return (<BoxWithPopper {...box} isActive={isActive} key={index} setReactivationModalDisplay={setReactivationModalDisplay} />);
        }
        return (
          <Box
            key={`box${index}`}
            width={width}
            color={color}
            bigText={bigText}
            medText={medText}
            tinyText={tinyText}
          />
        );
      })}
    </Wrapper>
  );
};

Boxes.propTypes = {
  isActive: PropTypes.bool,
  summary: PropTypes.object,
  setReactivationModalDisplay: PropTypes.func,
};

export default Boxes;
