import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';

const StyledTooltip = styled((props) => (
  <Tooltip
    classes={{ popper: props.className, tooltip: 'tooltip' }}
    {...props}
  />
))`
  & .tooltip {
    background-color: ${(props) => props.theme.gray800};
    color: ${(props) => props.theme.gray50};
    padding: 10px;
    font-family: Avenir;
    font-size: 12px;
    font-weight: 500;
    & > span {
      color: ${(props) => props.theme.gray800};
    }
  }
`;

const BloxTooltip = ({ children, title, placement }) => (
  <StyledTooltip title={title} placement={placement} arrow>
    {children}
  </StyledTooltip>
);

BloxTooltip.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  placement: PropTypes.string,
};

export default BloxTooltip;
