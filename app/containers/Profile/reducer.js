/*
 *
 * Profile reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SELECT_ACCOUNT_OPTION,
	TOGGLE_SIGN_IN,
	USER_LOGGED_IN,
} from './constants';
// TODO: When authentication is set up grab the JWT from localStorage and use JWT to set userAuthenticated

const initialState = fromJS({
	activeOption: 'login',
	signInActive: false,
	userAuthenticated: false,
});

function profileReducer(state = initialState, action) {
	switch (action.type) {
	case SELECT_ACCOUNT_OPTION:
		return state.set('activeOption', action.option);
	case TOGGLE_SIGN_IN:
		return state.set('signInActive', action.state);
	case USER_LOGGED_IN:
		return state.set('userAuthenticated', true);
	default:
		return state;
	}
}

export default profileReducer;
