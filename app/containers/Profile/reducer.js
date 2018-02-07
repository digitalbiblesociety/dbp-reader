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
	SIGNUP_ERROR,
	LOGIN_ERROR,
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
	loginErrorMessage: '',
	signupErrorMessage: '',
	userProfile: {
		password: '',
		email: '',
		country: '',
		address1: '',
		address2: '',
		city: '',
		state: '',
		zip: '',
	},
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
	case SIGNUP_ERROR:
		return state.set('signupErrorMessage', action.message);
	case LOGIN_ERROR:
		return state.set('loginErrorMessage', action.message);
	default:
		return state;
	}
}

export default profileReducer;
