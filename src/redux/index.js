import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import createRootReducer from './reducers';

const initialState = {};

export const history = createBrowserHistory();
export const store = createStore(
  createRootReducer(history),
  initialState,
  compose(applyMiddleware(routerMiddleware(history), createLogger())),
);
