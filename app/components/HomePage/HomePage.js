import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Wallet, Validators } from './components';
import { normalizeAccountsData } from './service';

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 70px);
  background-color: ${({ theme }) => theme.gray50};
  display: flex;
  flex-direction: column;
  padding: 44px 94px;
`;

const HomePage = (props) => {
  const { walletStatus, accounts } = props;
  const normalizedAccounts = accounts && normalizeAccountsData(accounts);
  return (
    <Wrapper>
      <Wallet isActive={walletStatus === 'active'} />
      <Validators accounts={normalizedAccounts} />
    </Wrapper>
  );
};

HomePage.propTypes = {
  walletStatus: PropTypes.string,
  accounts: PropTypes.array,
};

export default HomePage;
