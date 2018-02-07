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
	UPDATE_EMAIL,
	UPDATE_USER_INFORMATION,
	RESET_PASSWORD,
	DELETE_USER,
	LOG_OUT,
} from './constants';

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
