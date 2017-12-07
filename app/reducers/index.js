import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import searchReducer from './searchReducer';
import tempQueueReducer from './tempQueueReducer';

const rootReducer = combineReducers({
  search: searchReducer,
  tempQueue: tempQueueReducer
});

const store = createStore(rootReducer, {}, applyMiddleware(thunk, logger));

export default store;