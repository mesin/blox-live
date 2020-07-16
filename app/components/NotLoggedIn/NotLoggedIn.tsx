import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';

import Login from '../Login';
import CallbackPage from '../CallbackPage';
import NotFoundPage from '../NotFoundPage';

const NotLoggedIn = (props: Props) => {
  const { auth } = props;
  return (
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/login" />} />
      <Route
        path="/login"
        render={(renderProps) => <Login auth={auth} {...renderProps} />}
      />
      <Route path="/callback" component={CallbackPage} {...props} />
      <Route path="" component={NotFoundPage} />
    </Switch>
  );
};

interface Props extends RouteComponentProps {
  auth: Record<string, any>;
}

export default withRouter(NotLoggedIn);
