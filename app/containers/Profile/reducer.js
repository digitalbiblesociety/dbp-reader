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
	CLEAR_ERROR_MESSAGE,
	RESET_PASSWORD_ERROR,
	RESET_PASSWORD_SUCCESS,
	DELETE_USER_SUCCESS,
	DELETE_USER_ERROR,
	OAUTH_ERROR,
	READ_OAUTH_ERROR,
} from './constants';

const initialState = fromJS({
	activeOption: 'login',
	userAuthenticated:
		!!localStorage.getItem('bible_is_user_id') ||
		!!sessionStorage.getItem('bible_is_user_id') ||
		false,
	userId:
		localStorage.getItem('bible_is_user_id') ||
		sessionStorage.getItem('bible_is_user_id') ||
		'',
	loginErrorMessage: '',
	socialLoginLink: '',
	signupErrorMessage: '',
	activeDriver: '',
	userProfile: {
		email: sessionStorage.getItem('bible_is_12345') || '',
		nickname: sessionStorage.getItem('bible_is_123456') || '',
		name: sessionStorage.getItem('bible_is_1234567') || '',
		avatar: sessionStorage.getItem('bible_is_12345678') || '',
		verified: false,
		accounts: [],
	},
	errorMessageViewed: true,
	passwordResetError: '',
	passwordResetMessage: '',
	deleteUserError: false,
	deleteUserMessage: '',
});

function profileReducer(state = initialState, action) {
	switch (action.type) {
		case SOCIAL_MEDIA_LOGIN:
			return state.set('activeDriver', action.driver);
		case OAUTH_ERROR:
			return state
				.set('oauthError', true)
				.set('oauthErrorMessage', action.message);
		case READ_OAUTH_ERROR:
			return state.set('oauthError', false);
		case SELECT_ACCOUNT_OPTION:
			return state.set('activeOption', action.option);
		case USER_LOGGED_IN:
			// console.log('Logged in and reducer fired', action);

			sessionStorage.setItem('bible_is_12345', action.userProfile.email);
			sessionStorage.setItem('bible_is_123456', action.userProfile.nickname);
			sessionStorage.setItem('bible_is_1234567', action.userProfile.name);
			sessionStorage.setItem('bible_is_12345678', action.userProfile.avatar);
			return state
				.set('userId', action.userId)
				.set('userProfile', action.userProfile)
				.set('userAuthenticated', true);
		case LOG_OUT:
			// Need to remove the user's id from storage when they log out
			localStorage.removeItem('bible_is_user_id');
			sessionStorage.removeItem('bible_is_user_id');
			return state.set('userId', '').set('userAuthenticated', false);
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
		case RESET_PASSWORD_ERROR:
			return state.set('passwordResetError', action.message);
		case ERROR_MESSAGE_VIEWED:
			return state
				.set('errorMessageViewed', true)
				.set('deleteUserError', false)
				.set('deleteUserMessage', '');
		case RESET_PASSWORD_SUCCESS:
			return state.set('passwordResetMessage', action.message);
		case CLEAR_ERROR_MESSAGE:
			return state
				.set('errorMessageViewed', true)
				.set('signupErrorMessage', '')
				.set('passwordResetError', '')
				.set('loginErrorMessage', '');
		case DELETE_USER_SUCCESS:
			localStorage.removeItem('bible_is_user_id');
			return state.set('userAuthenticated', false).set('userId', '');
		case DELETE_USER_ERROR:
			return state
				.set('deleteUserError', true)
				.set('deleteUserMessage', action.message);
		default:
			return state;
	}
}

export default profileReducer;
