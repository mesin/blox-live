import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from 'utils/history';
import globalReducer from 'components/App/reducer';
import login from './components/CallbackPage/reducer';
import organization from './components/Organization/reducer';
import wizard from './components/Wizard/reducer';
import metaMask from './components/MetaMask/reducer';
import websocket from './components/WebSockets/reducer';
import accounts from './components/Accounts/reducer';

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    global: globalReducer,
    router: connectRouter(history),
    login,
    organization,
    wizard,
    metaMask,
    websocket,
    accounts,
    ...injectedReducers,
  });

  return rootReducer;
}
