import {
  FETCH_ANIME,
  FETCH_CONTINUING_ANIME
} from '../actions/types';

const INITIAL_STATE = {
	anime: null,
	continuingAnime: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  	case FETCH_ANIME:
  		return {...state, anime: action.payload}
  	case FETCH_CONTINUING_ANIME:
		return {...state, continuingAnime: action.payload}
    default:
      return state;
  }
}
