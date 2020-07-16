import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Loader } from '../../common/components';
import * as loginActions from './actions';
import { getIsLoggedIn } from './selectors';
import saga from './saga';
import { useInjectSaga } from '../../utils/injectSaga';

const key = 'login';

const CallbackPage = (props: Props) => {
  const { isLoggedIn } = props;
  useInjectSaga({ key, saga, mode: '' });
  useEffect(() => {
    const startLogin = async () => {
      const { location, actions } = props;
      const queryStrings = /access_token|id_token|error/;
      if (queryStrings.test(location.hash)) {
        await actions.login();
      } else {
        throw new Error('Invalid callback URL');
      }
    };
    !isLoggedIn && startLogin();
  }, [isLoggedIn]);
  return <Loader />;
};

const mapStateToProps = (state: State) => ({
  isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(loginActions, dispatch),
});

type Props = {
  history: Record<string, any>;
  location: Record<string, any>;
  actions: Record<string, any>;
  isLoggedIn: boolean;
};

type State = Record<string, any>;
type Dispatch = (arg0: { type: string }) => any;

export default connect(mapStateToProps, mapDispatchToProps)(CallbackPage);
