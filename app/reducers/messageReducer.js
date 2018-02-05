import {
	UPDATE_MESSAGE_QUEUE,
  DELETE_MESSAGE_QUEUE,
  CLEAR_MESSAGE_QUEUE
} from '../actions/types';

const INITIAL_STATE = {
	messages: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  	case UPDATE_MESSAGE_QUEUE:
  		return {...state, messages: action.payload}
    case DELETE_MESSAGE_QUEUE:
      var tempMessages = state.messages.filter(item => item !== action.payload);
      if(tempMessages.length === 0) {
        tempMessages = null;
      } 
      return {
        ...state,
        messages: tempMessages
      }
    case CLEAR_MESSAGE_QUEUE:
      return {...state, messages: null}
    default:
      return state;
  }
}
