import {
  FETCH_ANIME
} from '../actions/types';

const INITIAL_STATE = {
	anime: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  	case FETCH_ANIME:
  		return {...state, anime: action.payload}
    default:
      return state;
  }
}
