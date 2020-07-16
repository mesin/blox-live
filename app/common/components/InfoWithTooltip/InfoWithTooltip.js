import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tooltip from '../Tooltip';

const infoImage = require('../../../assets/images/info.svg');

const Image = styled.img`
  width: 13px;
  height: 13px;
  margin: 0px 6px 2px 2px;
`;

const InfoWithTooltip = ({ title, placement }) => (
  <Tooltip title={title} placement={placement}>
    <Image src={infoImage} />
  </Tooltip>
);

InfoWithTooltip.propTypes = {
  title: PropTypes.string,
  placement: PropTypes.string,
};

export default InfoWithTooltip;
