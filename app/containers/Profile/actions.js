/*
 *
 * Profile actions
 *
 */

import {
	SELECT_ACCOUNT_OPTION,
	TOGGLE_SIGN_IN,
	LOAD_USER_DATA,
	GET_USER_DATA,
	SEND_LOGIN_FORM,
	SEND_SIGNUP_FORM,
	UPDATE_PASSWORD,
	RESET_PASSWORD,
	DELETE_USER,
} from './constants';

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

export const toggleSignInForm = (state) => ({
	type: TOGGLE_SIGN_IN,
	state,
});

export const deleteUser = ({ username, email, userId }) => ({
	type: DELETE_USER,
	username,
	email,
	userId,
});

export const resetPassword = ({ newPassword, email }) => ({
	type: RESET_PASSWORD,
	newPassword,
	email,
});

export const updatePassword = ({ previousPassword, newPassword, userId }) => ({
	type: UPDATE_PASSWORD,
	previousPassword,
	newPassword,
	userId,
});

export const sendLoginForm = ({ password, username, email }) => ({
	type: SEND_LOGIN_FORM,
	password,
	username,
	email,
});

export const sendSignUpForm = ({ password, username, email }) => ({
	type: SEND_SIGNUP_FORM,
	password,
	username,
	email,
});
