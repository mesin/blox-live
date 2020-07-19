import React from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';

import Login from '../Login';
import CallbackPage from '../CallbackPage';
import NotFoundPage from '../NotFoundPage';

const NotLoggedIn = () => {
  return (
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/login" />} />
      <Route path="/login" component={Login} />
      <Route path="/callback" component={CallbackPage} />
      <Route path="" component={NotFoundPage} />
    </Switch>
  );
};

export default withRouter(NotLoggedIn);
