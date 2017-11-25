import {
	FETCH_SUGGESTIONS
} from '../actions/types';

const INITIAL_STATE = {
	queried: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  	case FETCH_SUGGESTIONS:
  		return {...state, queried: action.payload}
    default:
      return state;
  }
}
