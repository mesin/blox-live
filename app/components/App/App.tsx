import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { remote } from 'electron';

import LoggedIn from '../LoggedIn';
import NotLoggedIn from '../NotLoggedIn';

import GlobalStyle from '../../common/styles/global-styles';
import { initApp } from './service';

import { getIsLoggedIn, getIsLoading } from '../CallbackPage/selectors';
import * as loginActions from '../CallbackPage/actions';
import loginSaga from '../CallbackPage/saga';
import userSaga from '../User/saga';

import { Loader } from '../../common/components';
import { useInjectSaga } from '../../utils/injectSaga';

const AppWrapper = styled.div`
  margin: 0 auto;
  height: 100%;
`;

const loginKey = 'login';
const userKey = 'user';

const App = (props: Props) => {
  const [didInitApp, setAppInitialised] = useState(false);
  useInjectSaga({ key: userKey, saga: userSaga, mode: '' });
  useInjectSaga({ key: loginKey, saga: loginSaga, mode: '' });
  const { isLoggedIn, isLoading, actions } = props;
  const { setSession, loginFailure } = actions;

  const init = async () => {
    await setAppInitialised(true);
    await initApp();
  };

  useEffect(() => {
    if (!didInitApp) {
      init();
      remote.app.on('open-url', (event, data) => {
        if (data) {
          const questionMarkIndex = data.indexOf('//');
          const trimmedCode = data.substring(questionMarkIndex + 2);
          try {
            setSession(trimmedCode);
          }
          catch (e) {
            loginFailure(e);
          }
        }
      });
    }
  }, [didInitApp, isLoggedIn, isLoading]);

  if (!didInitApp || isLoading) {
    return <Loader />;
  }

  return (
    <AppWrapper>
      {isLoggedIn ? <LoggedIn /> : <NotLoggedIn />}
      <GlobalStyle />
    </AppWrapper>
  );
};

type Props = {
  isLoggedIn: boolean;
  isLoading: boolean;
  isTokensExist: () => void;
  actions: Record<string, any>;
};

const mapStateToProps = (state: any) => ({
  isLoggedIn: getIsLoggedIn(state),
  isLoading: getIsLoading(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(loginActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
