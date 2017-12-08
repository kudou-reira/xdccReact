import {
	SEND_TEMP_QUEUE,
  DOWNLOAD_TEMP_QUEUE
} from '../actions/types';

const INITIAL_STATE = {
	download: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  	case SEND_TEMP_QUEUE:
  		return {...state, download: action.payload}
    case DOWNLOAD_TEMP_QUEUE:
      return {...state, download: action.payload}
    default:
      return state;
  }
}
