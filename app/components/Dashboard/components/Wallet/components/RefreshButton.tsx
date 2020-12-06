import React from 'react';
import styled from 'styled-components';
import { Icon } from 'common/components';
import useDashboardData from '../../../useDashboardData';

const Wrapper = styled.button`
  background-color:transparent;
  border:0px;
  outline:none;
  cursor:pointer;
  display:flex;
  align-items:center;
  padding:0px;
  margin:1px 0px 0px 8px;
`;

const Text = styled.span`
  margin:1px 0px 0px 4px;
  font-size: 11px;
  font-weight: 900;
  color: ${({theme}) => theme.primary900};
`;

const RefreshButton = () => {
  const { loadDashboardData } = useDashboardData();
  return (
    <Wrapper onClick={() => loadDashboardData()}>
      <Icon name={'refresh'} fontSize={'13px'} color={'primary900'} />
      <Text>Refresh Data</Text>
    </Wrapper>
  );
};

export default RefreshButton;
