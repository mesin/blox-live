import React from 'react';
import styled from 'styled-components';
import { LinearProgress } from '@material-ui/core';

const ProgressBar = styled((props) => (
  <LinearProgress
    variant={'determinate'}
    classes={{ loader: props.classes, determinate: 'progressbar' }}
    {...props}
  />
))`
  &.progressbar {
    width: ${({width}) => width || '100%'};
    height: 8px;
    border-radius:2px;
    background-color: ${(props) => props.theme.gray200};
    .MuiLinearProgress-barColorPrimary {
      background-color: ${(props) => props.theme.primary900};
    }
  }
`;

export default ProgressBar;
