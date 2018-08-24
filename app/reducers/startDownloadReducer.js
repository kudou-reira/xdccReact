import {
  START_DOWNLOAD,
  DOWNLOADING_ITEMS
} from '../actions/types';

const INITIAL_STATE = {
	download: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case START_DOWNLOAD:
      return {...state, download: action.payload}
    case DOWNLOADING_ITEMS:
      return {...state, download: action.payload}
    default:
      return state;
  }
}