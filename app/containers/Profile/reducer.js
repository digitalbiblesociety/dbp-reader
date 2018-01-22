/*
 *
 * Profile reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SELECT_ACCOUNT_OPTION,
	USER_LOGGED_IN,
	LOG_OUT,
	// LOAD_USER_DATA,
	// GET_USER_DATA,
	// SEND_LOGIN_FORM,
	// SEND_SIGNUP_FORM,
	// UPDATE_PASSWORD,
	// RESET_PASSWORD,
	// DELETE_USER,
} from './constants';
// TODO: When authentication is set up grab the JWT from localStorage and use JWT to set userAuthenticated

const initialState = fromJS({
	activeOption: 'login',
	userAuthenticated: false,
	userId: '',
});

function profileReducer(state = initialState, action) {
	switch (action.type) {
	case SELECT_ACCOUNT_OPTION:
		return state.set('activeOption', action.option);
	case USER_LOGGED_IN:
		return state
			.set('userId', action.userId)
			.set('userAuthenticated', true);
	case LOG_OUT:
		return state
			.set('userId', '')
			.set('userAuthenticated', false);
	default:
		return state;
	}
}

export default profileReducer;
