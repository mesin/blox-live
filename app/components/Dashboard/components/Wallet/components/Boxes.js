import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Box from './Box';
import { getBoxes } from './service';

const Wrapper = styled.div`
  width: 100%;
  height: 168px;
  display: flex;
  justify-content: space-between;
`;

const Boxes = (props) => {
  const { isActive, summary } = props;
  const boxes = getBoxes(isActive, summary);
  return (
    <Wrapper>
      {boxes.map((box, index) => {
        const { width, color, bigText, medText, tinyText, image } = box;
        return (
          <Box
            key={index}
            width={width}
            color={color}
            bigText={bigText}
            medText={medText}
            tinyText={tinyText}
            image={image}
          />
        );
      })}
    </Wrapper>
  );
};

Boxes.propTypes = {
  isActive: PropTypes.bool,
  summary: PropTypes.object,
};

export default Boxes;
