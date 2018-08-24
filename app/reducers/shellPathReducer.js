import {
  OPEN_SHELL,
  DEFAULT_SHELL
} from '../actions/types';

const INITIAL_STATE = {
	path: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
  	case OPEN_SHELL:
  		return {...state, path: action.payload}
  	case DEFAULT_SHELL:
  		return {...state, path: action.payload}
    default:
      return state;
  }
}
