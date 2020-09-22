import {
  configureStore,
} from '@reduxjs/toolkit';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import createRootReducer from './rootReducer';

export const history = createHashHistory();
const rootReducer = createRootReducer(history);

const router = routerMiddleware(history);

const reduxSagaMonitorOptions = {};

const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);

const middleware = [router, sagaMiddleware];

const excludeLoggerEnvs = ['test', 'production'];
const shouldIncludeLogger = !excludeLoggerEnvs.includes(process.env.NODE_ENV || '');

if (shouldIncludeLogger) {
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });
  middleware.push(logger);
}

export const configuredStore = (initialState) => { // TODO: remove configureStore from redux/toolkit
  const store = configureStore({
    reducer: rootReducer,
    middleware,
    preloadedState: initialState,
  });

  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept(
      './rootReducer',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('./rootReducer').default)
    );
  }
  return store;
};

// export type RootState = ReturnType<typeof rootReducer>;
// export type Store = ReturnType<typeof configuredStore>;
// export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
