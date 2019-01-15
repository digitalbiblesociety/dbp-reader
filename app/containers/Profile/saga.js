import { takeLatest, call, take, cancel, put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request from '../../utils/request';
import {
	CHANGE_PICTURE,
	LOGIN_ERROR,
	USER_LOGGED_IN,
	SEND_LOGIN_FORM,
	SIGNUP_ERROR,
	SEND_SIGNUP_FORM,
	SEND_PASSWORD_RESET,
	SOCIAL_MEDIA_LOGIN,
	SOCIAL_MEDIA_LOGIN_SUCCESS,
	DELETE_USER,
	RESET_PASSWORD,
	UPDATE_EMAIL,
	RESET_PASSWORD_SUCCESS,
	RESET_PASSWORD_ERROR,
	UPDATE_USER_INFORMATION,
	DELETE_USER_SUCCESS,
	DELETE_USER_ERROR,
} from './constants';

export function* sendSignUpForm({
	password,
	email,
	firstName,
	lastName,
	wantsUpdates,
}) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/users?key=${
		process.env.DBP_API_KEY
	}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const data = new FormData();

	data.append('email', email);
	data.append('password', password);
	data.append('name', lastName);
	data.append('first_name', firstName);
	data.append('subscribed', wantsUpdates ? '1' : '0');
	data.append('avatar', '');
	data.append('project_id', process.env.NOTES_PROJECT_ID);

	const options = {
		method: 'POST',
		body: data,
	};

	try {
		const response = yield call(request, requestUrl, options);

		if (response.data) {
			yield put({
				type: USER_LOGGED_IN,
				userId: response.data.id,
				userProfile: response.data,
			});
			sessionStorage.setItem('bible_is_user_id', response.data.id);
			sessionStorage.setItem('bible_is_user_email', response.data.email);
			sessionStorage.setItem('bible_is_user_name', response.data.name);
			sessionStorage.setItem('bible_is_user_nickname', response.data.nickname);
		} else if (response.error) {
			const message = Object.values(response.error.message).reduce(
				(acc, cur) => acc.concat(cur),
				'',
			);
			yield put({ type: SIGNUP_ERROR, message });
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* sendLoginForm({ password, email, stay }) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/login?key=${
		process.env.DBP_API_KEY
	}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const formData = new FormData();

	formData.append('password', password);
	formData.append('email', email);

	const options = {
		method: 'POST',
		body: formData,
	};

	try {
		const response = yield call(request, requestUrl, options);
		if (response.error) {
			yield put({ type: LOGIN_ERROR, message: response.error.message });
		} else {
			yield put({
				type: USER_LOGGED_IN,
				userId: response.id,
				userProfile: response,
			});

			if (stay) {
				localStorage.setItem('bible_is_user_id', response.id);
				localStorage.setItem('bible_is_user_email', response.email);
				localStorage.setItem('bible_is_user_name', response.name);
				localStorage.setItem('bible_is_user_nickname', response.nickname);
			} else {
				sessionStorage.setItem('bible_is_user_id', response.id);
				sessionStorage.setItem('bible_is_user_email', response.email);
				sessionStorage.setItem('bible_is_user_name', response.name);
				sessionStorage.setItem('bible_is_user_nickname', response.nickname);
			}
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
		yield put({
			type: LOGIN_ERROR,
			message: 'Invalid credentials, please try again.',
		});
	}
}

export function* updateEmail({ userId, email }) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/users/${userId}?key=${
		process.env.DBP_API_KEY
	}&v=4&project_id=${process.env.NOTES_PROJECT_ID}`;
	const formData = new FormData();

	formData.append('email', email);

	const options = {
		method: 'PUT',
		body: formData,
	};

	try {
		const response = yield call(request, requestUrl, options);
		yield put({ type: 'UPDATE_EMAIL_SUCCESS', response });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* updateUserInformation({ userId, profile }) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/users/${userId}?key=${
		process.env.DBP_API_KEY
	}&v=4&project_id=${process.env.NOTES_PROJECT_ID}`;
	const formData = new FormData();
	Object.entries(profile).forEach(
		(entry) => entry[1] && formData.set(entry[0], entry[1]),
	);

	const options = {
		method: 'PUT',
		body: formData,
	};

	try {
		const response = yield call(request, requestUrl, options);
		yield put({ type: 'UPDATE_EMAIL_SUCCESS', response });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// Route: /users/{id}
// Method: POST
// Extra Header: _method: PUT
// Content Type: form-data
export function* changePicture({ userId, avatar }) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/users/${userId}?key=${
		process.env.DBP_API_KEY
	}&v=4`;
	const requestData = new FormData();
	requestData.append('avatar', avatar);
	requestData.append('_method', 'PUT');

	const requestOptions = {
		method: 'POST',
		_method: 'PUT',
		body: requestData,
	};

	try {
		const response = yield call(request, requestUrl, requestOptions);

		if (response.success) {
			// console.log('picture was saved successfully');
		} else {
			// console.log('picture was not saved', response);
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			// console.warn('Error saving picture: ', err);
		}
	}
}

export function* sendResetPassword({ password, userAccessToken, email }) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/users/password/reset?key=${
		process.env.DBP_API_KEY
	}&v=4&project_id=${
		process.env.NODE_ENV === 'development'
			? process.env.DEVELOPMENT_PROJECT_ID
			: process.env.NOTES_PROJECT_ID
	}`;
	const formData = new FormData();
	formData.append('email', email);
	formData.append(
		'project_id',
		process.env.NODE_ENV === 'development'
			? process.env.DEVELOPMENT_PROJECT_ID
			: process.env.NOTES_PROJECT_ID,
	);
	formData.append('new_password', password);
	formData.append('new_password_confirmation', password);
	formData.append('token_id', userAccessToken);

	const options = {
		body: formData,
		method: 'POST',
	};

	try {
		const response = yield call(request, requestUrl, options);

		yield put({
			type: USER_LOGGED_IN,
			userId: response.id,
			userProfile: response,
		});
		document.cookie = `bible_is_email=${response.email};path=/`;
		document.cookie = `bible_is_name=${response.name};path=/`;
		document.cookie = `bible_is_first_name=${response.first_name};path=/`;
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('error in reset password', err); // eslint-disable-line no-console
		}
		yield put({
			type: RESET_PASSWORD_ERROR,
			message:
				'There was a problem resetting your password. Please try again or contact support.',
		});
	}
}

export function* resetPassword({ email }) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/users/password/email?key=${
		process.env.DBP_API_KEY
	}&v=4&project_id=${
		process.env.NODE_ENV === 'development'
			? process.env.DEVELOPMENT_PROJECT_ID
			: process.env.NOTES_PROJECT_ID
	}`;
	const resetPath = `${window.location.href ||
		`${window.location.protocol}//${window.location.hostname}${
			window.location.pathname
		}`}`;
	// Probably want to somehow get the language of the currently active text or something to use here as a fallback
	const browserLanguage =
		window && window.navigator ? window.navigator.language : 'en';

	const formData = new FormData();
	formData.append('email', email);
	formData.append(
		'project_id',
		process.env.NODE_ENV === 'development'
			? process.env.DEVELOPMENT_PROJECT_ID
			: process.env.NOTES_PROJECT_ID,
	);
	formData.append('iso', browserLanguage);
	formData.append('reset_path', resetPath);

	const options = {
		body: formData,
		method: 'POST',
	};

	try {
		const response = yield call(request, requestUrl, options);

		if (response.error) {
			yield put({
				type: RESET_PASSWORD_ERROR,
				message: response.error.message,
			});
		} else {
			yield put({
				type: RESET_PASSWORD_SUCCESS,
				message:
					'Thank you! An email with instructions has been sent to your account.',
			});
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
		yield put({
			type: RESET_PASSWORD_ERROR,
			message: 'There was a problem sending your email. Please try again. ',
		});
	}
}

export function* deleteUser({ userId }) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/users/${userId}?key=${
		process.env.DBP_API_KEY
	}&v=4&project_id=${process.env.NOTES_PROJECT_ID}`;
	const options = {
		method: 'DELETE',
	};

	try {
		const response = yield call(request, requestUrl, options);

		yield put({ type: DELETE_USER_SUCCESS, response });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
		yield put({
			type: DELETE_USER_ERROR,
			message: 'There was an error deleting your account.',
		});
	}
}

export function* socialMediaLogin({ driver }) {
	let requestUrl = `${process.env.BASE_API_ROUTE}/login/${driver}?key=${
		process.env.DBP_API_KEY
	}&v=4&project_id=${process.env.NOTES_PROJECT_ID}`;

	if (process.env.NODE_ENV === 'development') {
		requestUrl = `${process.env.BASE_API_ROUTE}/login/${driver}?key=${
			process.env.DBP_API_KEY
		}&v=4&project_id=${process.env.NOTES_PROJECT_ID}&alt_url=${process.env
			.NODE_ENV === 'development'}`;
	}

	try {
		const response = yield call(request, requestUrl);

		if (response) {
			yield put({ type: SOCIAL_MEDIA_LOGIN_SUCCESS, url: response });
		}
	} catch (err) {
		if (err && process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	const sendSignUpFormSaga = yield takeLatest(SEND_SIGNUP_FORM, sendSignUpForm);
	const sendLoginFormSaga = yield takeLatest(SEND_LOGIN_FORM, sendLoginForm);
	const sendResetPasswordSaga = yield takeLatest(
		SEND_PASSWORD_RESET,
		sendResetPassword,
	);
	const resetPasswordSaga = yield takeLatest(RESET_PASSWORD, resetPassword);
	const deleteUserSaga = yield takeLatest(DELETE_USER, deleteUser);
	const updateUserInformationSaga = yield takeLatest(
		UPDATE_USER_INFORMATION,
		updateUserInformation,
	);
	const updateEmailSaga = yield takeLatest(UPDATE_EMAIL, updateEmail);
	const socialMediaLoginSaga = yield takeLatest(
		SOCIAL_MEDIA_LOGIN,
		socialMediaLogin,
	);
	const changePictureSaga = yield takeLatest(CHANGE_PICTURE, changePicture);

	yield take(LOCATION_CHANGE);
	yield cancel(changePictureSaga);
	yield cancel(sendSignUpFormSaga);
	yield cancel(sendLoginFormSaga);
	yield cancel(sendResetPasswordSaga);
	yield cancel(resetPasswordSaga);
	yield cancel(deleteUserSaga);
	yield cancel(updateUserInformationSaga);
	yield cancel(updateEmailSaga);
	yield cancel(socialMediaLoginSaga);
}
