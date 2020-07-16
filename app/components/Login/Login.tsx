import React from 'react';
import styled from 'styled-components';
import { Left, Right } from './components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background-image: url('assets/images/bg_staking.jpg');
  background-size: contain;
`;

const Login = ({ auth }: Props) => (
  // TODO: add saga here or under auth component
  <Wrapper>
    <Left />
    <Right auth={auth} />
  </Wrapper>
);
type Props = {
  auth: Record<string, any>;
};

export default Login;
