/*
 *
 * Profile actions
 * TODO: Add factory function for actions to reduce boilerplate
 */

import {
	SELECT_ACCOUNT_OPTION,
	LOAD_USER_DATA,
	GET_USER_DATA,
	SEND_LOGIN_FORM,
	SEND_SIGNUP_FORM,
	UPDATE_PASSWORD,
	RESET_PASSWORD,
	DELETE_USER,
	LOG_OUT,
} from './constants';

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

export const sendLoginForm = ({ password, username, email, firstName, lastName }) => ({
	type: SEND_LOGIN_FORM,
	password,
	username,
	email,
	firstName,
	lastName,
});

export const sendSignUpForm = ({ password, username, email }) => ({
	type: SEND_SIGNUP_FORM,
	password,
	username,
	email,
});
