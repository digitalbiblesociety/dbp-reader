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
	userAuthenticated: false,
	userId: '',
	loginErrorMessage: '',
	socialLoginLink: '',
	signupErrorMessage: '',
	activeDriver: '',
	userProfile: {
		email: '',
		nickname: '',
		name: '',
		avatar: '',
		verified: false,
		accounts: [],
	},
	errorMessageViewed: true,
	passwordResetError: '',
	passwordResetMessage: '',
	deleteUserError: false,
	deleteUserMessage: '',
	passwordWasReset: false,
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
			if (typeof window !== 'undefined') {
				sessionStorage.setItem(
					'bible_is_user_email',
					action.userProfile.email || '',
				);
				sessionStorage.setItem(
					'bible_is_user_nickname',
					action.userProfile.nickname || '',
				);
				sessionStorage.setItem(
					'bible_is_user_name',
					action.userProfile.name || '',
				);
			}

			return state
				.set('userId', action.userId)
				.set('userProfile', action.userProfile)
				.set('userAuthenticated', true);
		case LOG_OUT:
			// Need to remove the user's id from storage when they log out
			localStorage.removeItem('bible_is_user_id');
			localStorage.removeItem('bible_is_user_email');
			localStorage.removeItem('bible_is_user_name');
			localStorage.removeItem('bible_is_user_nickname');
			sessionStorage.removeItem('bible_is_user_id');
			sessionStorage.removeItem('bible_is_user_email');
			sessionStorage.removeItem('bible_is_user_name');
			sessionStorage.removeItem('bible_is_user_nickname');
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
			localStorage.removeItem('bible_is_user_email');
			localStorage.removeItem('bible_is_user_name');
			localStorage.removeItem('bible_is_user_nickname');
			sessionStorage.removeItem('bible_is_user_id');
			sessionStorage.removeItem('bible_is_user_email');
			sessionStorage.removeItem('bible_is_user_name');
			sessionStorage.removeItem('bible_is_user_nickname');
			return state.set('userAuthenticated', false).set('userId', '');
		case DELETE_USER_ERROR:
			return state
				.set('deleteUserError', true)
				.set('deleteUserMessage', action.message);
		case 'GET_INITIAL_ROUTE_STATE_PROFILE':
			return state.merge(action.profile);
		case 'persist/REHYDRATE':
			// TODO: Ask for Sam's input on this to see if I can get around it
			if (state.get('userId')) {
				return action.payload.profile
					.set('userProfile', state.get('userProfile'))
					.set('userAuthenticated', state.get('userAuthenticated'))
					.set('userId', state.get('userId'));
			}
			return state;
		default:
			return state;
	}
}

export default profileReducer;
