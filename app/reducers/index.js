import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import searchReducer from './searchReducer';
import tempQueueReducer from './tempQueueReducer';
import downloadListReducer from './downloadListReducer';
import startDownloadReducer from './startDownloadReducer';
import animeListReducer from './animeListReducer';
import shellPathReducer from './shellPathReducer';

const rootReducer = combineReducers({
  search: searchReducer,
  tempQueue: tempQueueReducer,
  downloadList: downloadListReducer,
  startDownload: startDownloadReducer,
  animeList: animeListReducer,
  shellPath: shellPathReducer
});

const store = createStore(rootReducer, {}, applyMiddleware(thunk, logger));

export default store;