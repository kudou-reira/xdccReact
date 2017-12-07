import {
	UPDATE_TEMP_QUEUE,
	DELETE_TEMP_QUEUE
} from '../actions/types';

const INITIAL_STATE = {
	stack: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  	case UPDATE_TEMP_QUEUE:
  		return {...state, stack: action.payload}
  	case DELETE_TEMP_QUEUE:
      return {
        ...state,
        stack: state.stack.filter(item => item !== action.payload)
      }
    default:
      return state;
  }
}
