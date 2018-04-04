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
	SOCIAL_MEDIA_LOGIN_SUCCESS,
	SOCIAL_MEDIA_LOGIN,
	ERROR_MESSAGE_VIEWED,
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
	userAuthenticated: !!localStorage.getItem('bible_is_user_id') || !!sessionStorage.getItem('bible_is_user_id') || false,
	userId: localStorage.getItem('bible_is_user_id') || sessionStorage.getItem('bible_is_user_id') || '',
	loginErrorMessage: '',
	socialLoginLink: '',
	signupErrorMessage: '',
	activeDriver: '',
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
	errorMessageViewed: false,
});

function profileReducer(state = initialState, action) {
	switch (action.type) {
	case SOCIAL_MEDIA_LOGIN:
		return state.set('activeDriver', action.driver);
	case SELECT_ACCOUNT_OPTION:
		return state.set('activeOption', action.option);
	case USER_LOGGED_IN:
		return state
			.set('userId', action.userId)
			.set('userAuthenticated', true);
	case LOG_OUT:
		// Need to remove the user's id from storage when they log out
		localStorage.removeItem('bible_is_user_id');
		sessionStorage.removeItem('bible_is_user_id');
		return state
			.set('userId', '')
			.set('userAuthenticated', false);
	case SIGNUP_ERROR:
		return state
			.set('errorMessageViewed', false)
			.set('signupErrorMessage', action.message);
	case LOGIN_ERROR:
		return state
			.set('errorMessageViewed', false)
			.set('loginErrorMessage', action.message);
	case SOCIAL_MEDIA_LOGIN_SUCCESS:
		return state.set('socialLoginLink', action.url);
	case ERROR_MESSAGE_VIEWED:
		return state.set('errorMessageViewed', true);
	default:
		return state;
	}
}

export default profileReducer;
