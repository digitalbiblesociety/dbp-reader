/*
 *
 * Profile actions
 *
 */

import {
	CHANGE_PICTURE,
	SELECT_ACCOUNT_OPTION,
	LOAD_USER_DATA,
	GET_USER_DATA,
	USER_LOGGED_IN,
	SEND_LOGIN_FORM,
	SEND_SIGNUP_FORM,
	SOCIAL_MEDIA_LOGIN,
	UPDATE_PASSWORD,
	UPDATE_EMAIL,
	UPDATE_USER_INFORMATION,
	RESET_PASSWORD,
	DELETE_USER,
	LOG_OUT,
	ERROR_MESSAGE_VIEWED,
	CLEAR_ERROR_MESSAGE,
	READ_OAUTH_ERROR,
	SEND_PASSWORD_RESET,
} from './constants';

export const setUserLoginStatus = (props) => ({
	type: USER_LOGGED_IN,
	...props,
});

export const readOauthError = (props) => ({
	type: READ_OAUTH_ERROR,
	...props,
});

export const changePicture = (props) => ({
	type: CHANGE_PICTURE,
	...props,
});

export const sendPasswordReset = (props) => ({
	type: SEND_PASSWORD_RESET,
	...props,
});

export const clearErrorMessage = (props) => ({
	type: CLEAR_ERROR_MESSAGE,
	...props,
});

export const viewErrorMessage = (props) => ({
	type: ERROR_MESSAGE_VIEWED,
	...props,
});

export const socialMediaLogin = (props) => ({
	type: SOCIAL_MEDIA_LOGIN,
	...props,
});

export const getUserNotes = ({ userId }) => ({
	type: GET_USER_DATA,
	userId,
});

export const logout = () => ({
	type: LOG_OUT,
});

export const getUserData = (userId) => ({
	type: GET_USER_DATA,
	userId,
});

export const loadUserData = (userData) => ({
	type: LOAD_USER_DATA,
	userData,
});

export const selectAccountOption = (option) => ({
	type: SELECT_ACCOUNT_OPTION,
	option,
});

export const deleteUser = ({ userId }) => ({
	type: DELETE_USER,
	userId,
});

export const resetPassword = ({ newPassword, email }) => ({
	type: RESET_PASSWORD,
	newPassword,
	email,
});

export const updateEmail = (props) => ({
	type: UPDATE_EMAIL,
	...props,
});

export const updateUserInformation = (props) => ({
	type: UPDATE_USER_INFORMATION,
	...props,
});

export const updatePassword = ({ password, userId }) => ({
	type: UPDATE_PASSWORD,
	password,
	userId,
});

export const sendLoginForm = (props) => ({
	type: SEND_LOGIN_FORM,
	...props,
});

export const sendSignUpForm = (props) => ({
	type: SEND_SIGNUP_FORM,
	...props,
});
