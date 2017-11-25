import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import searchReducer from './searchReducer';

const rootReducer = combineReducers({
  search: searchReducer
});

const store = createStore(rootReducer, {}, applyMiddleware(thunk, logger));

export default store;