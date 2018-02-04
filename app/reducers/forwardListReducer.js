import {
	UPDATE_FORWARD_LIST,
  SEND_FORWARD_LIST,
  REMOVE_FORWARD_LIST,
  CLEAR_FORWARD_LIST
} from '../actions/types';

const INITIAL_STATE = {
	forwardList: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  	case UPDATE_FORWARD_LIST:
  		return {...state, forwardList: action.payload}
    case SEND_FORWARD_LIST:
      return {...state, forwardList: action.payload}
    case REMOVE_FORWARD_LIST:
      return {
        ...state,
        download: state.download.filter(item => item !== action.payload)
      }
    case CLEAR_FORWARD_LIST:
      return {...state, forwardList: null}
    default:
      return state;
  }
}
