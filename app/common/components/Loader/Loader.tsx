import React from 'react';
import styled from 'styled-components';
import { LinearProgress } from '@material-ui/core';
import Spinner from '../Spinner';

const Wrapper = styled.div`
  width:100%;
  height:100%;
  position:fixed;
  top:0px;
  left:0px;
  background-color:rgba(0,0,0,0.1);
  display:flex;
  align-items:center;
  justify-content:center;
`;

const SpinnerWrapper = styled.div`
  width:90px;
  height:90px;
  border-radius:50%;
  background-color:${({theme}) => theme.gray100};
  display:flex;
  align-items:center;
  justify-content:center;
`;

const StyledLinearProgress = styled((props) => (
  <LinearProgress
    classes={{ loader: props.classes, indeterminate: 'progressbar' }}
    {...props}
  />
))`
  &.progressbar {
    width: 100%;
    height: 8px;
    position: absolute;
    bottom: 0px;
    background-color: ${(props) => props.theme.gray200};
    .MuiLinearProgress-barColorPrimary {
      background-color: ${(props) => props.theme.primary900};
    }
  }
`;

const Loader = (props) => {
  return (
    <Wrapper>
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
      <StyledLinearProgress {...props} />
    </Wrapper>
  );
};

export default Loader;
