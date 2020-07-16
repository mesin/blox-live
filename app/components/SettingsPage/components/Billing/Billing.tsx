import React from 'react';
import styled from 'styled-components';
import Title from '../Title';
import { Regular } from './components'; // NoPayments

const Wrapper = styled.div``;

const Billing = () => (
  <Wrapper>
    <Title>Plan Overview</Title>
    <Regular />
  </Wrapper>
);

export default Billing;
