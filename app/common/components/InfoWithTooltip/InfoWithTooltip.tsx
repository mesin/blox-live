import React from 'react';
import styled from 'styled-components';
import Tooltip from '../Tooltip';

import imageSrc from 'assets/images/info.svg';

const Image = styled.img`
  width: 13px;
  height: 13px;
  margin: 0px 6px 2px 2px;
`;

const InfoWithTooltip = ({ title, placement }: Props) => (
  <Tooltip title={title} placement={placement}>
    <Image src={imageSrc} />
  </Tooltip>
);

type Props = {
  title: string;
  placement: string;
};

export default InfoWithTooltip;
