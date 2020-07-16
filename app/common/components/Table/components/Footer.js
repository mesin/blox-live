import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  min-height: 30px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: solid 1px ${({ theme }) => theme.gray300};
`;

const Footer = () => <Wrapper />;

export default Footer;
