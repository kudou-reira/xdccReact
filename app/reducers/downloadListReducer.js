import {
	SEND_TEMP_QUEUE,
  DOWNLOAD_TEMP_QUEUE,
  REMOVE_DOWNLOAD,
  CLEAR_DOWNLOAD
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
    case REMOVE_DOWNLOAD:
      return {
        ...state,
        download: state.download.filter(item => item !== action.payload)
      }
    case CLEAR_DOWNLOAD:
      return {...state, download: null}
    default:
      return state;
  }
}
