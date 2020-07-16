import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import LoggedIn from '../LoggedIn';
import NotLoggedIn from '../NotLoggedIn';

import Auth from '../Auth';
import GlobalStyle from '../../common/styles/global-styles';
import { initApp } from './service';

import { getIsLoggedIn } from '../CallbackPage/selectors';

const AppWrapper = styled.div`
  margin: 0 auto;
  height: 100%;
`;

const App = (props: Props) => {
  const { isLoggedIn } = props;
  const auth = new Auth();
  auth && initApp(auth);
  return (
    <AppWrapper>
      {isLoggedIn ? <LoggedIn auth={auth} /> : <NotLoggedIn auth={auth} />}
      <GlobalStyle />
    </AppWrapper>
  );
};

type Props = {
  isLoggedIn: boolean;
};

const mapStateToProps = (state: any) => ({
  isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps)(App);
