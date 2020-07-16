import React from 'react';
import styled from 'styled-components';
import { LinearProgress } from '@material-ui/core';

const Loader = styled((props) => (
  <LinearProgress
    classes={{ loader: props.classes, indeterminate: 'progressbar' }}
    {...props}
  />
))`
  &.progressbar {
    width: 100%;
    height: 8px;
    position: fixed;
    bottom: 0px;
    background-color: ${(props) => props.theme.gray200};
    .MuiLinearProgress-barColorPrimary {
      background-color: ${(props) => props.theme.primary900};
    }
  }
`;

export default Loader;
