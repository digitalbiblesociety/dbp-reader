import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import {
	GET_USER_NOTES,
	// GET_USER_DATA,
	// LOAD_USER_DATA,
	LOGIN_ERROR,
	USER_LOGGED_IN,
	SEND_LOGIN_FORM,
	SIGNUP_ERROR,
	LOAD_USER_NOTES,
	SEND_SIGNUP_FORM,
	// DELETE_USER,
	// RESET_PASSWORD,
	// UPDATE_PASSWORD,
} from './constants';

import { getUserNotes } from './actions';

export function* getNotes({ userId }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.DBP_API_KEY}&v=4&pretty`;

	try {
		const response = yield call(request, requestUrl);
		const noteData = {
			notes: response.data,
			page: response.current_page,
			pageSize: response.per_page,
			pages: response.total,
		};

		yield put({ type: LOAD_USER_NOTES, noteData });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// export function* getUserData({ userId }) {
// 	const requestUrl = `https://api.bible.build/users/${userId}?key=${process.env.DBP_API_KEY}&v=4&pretty`;

// 	try {
// 		// const response = yield call(request, requestUrl);
// 		// console.log(response);
// 		//
// 		// yield put(LOAD_USER_DATA, { data: 'data' });
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-ignore-line no-console
// 		}
// 	}
// }

export function* sendSignUpForm({ password, email, username, firstName, lastName }) {
	const requestUrl = `https://api.bible.build/users?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	const data = new FormData();

	data.append('email', email);
	data.append('password', password);
	data.append('name', username);
	data.append('firstName', firstName);
	data.append('lastName', lastName);

	const options = {
		method: 'POST',
		body: data,
	};

	try {
		const response = yield call(request, requestUrl, options);
		// response will have the user_id now
		if (response.success) {
			yield put({ type: USER_LOGGED_IN, userId: response.user_id });
		} else if (response.error) {
			const message = Object.values(response.error.message).reduce((acc, cur) => acc.concat(cur), '');
			yield put({ type: SIGNUP_ERROR, message });
			console.log('signup error', message); // eslint-disable-line no-console
			// yield put('user-login-failed', response.error.message);
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* sendLoginForm({ password, email }) {
	const requestUrl = `https://api.bible.build/users/login?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	const formData = new FormData();

	formData.append('password', password);
	formData.append('email', email);

	const options = {
		method: 'POST',
		body: formData,
	};

	try {
		const response = yield call(request, requestUrl, options);
		// console.log('response in login', response);
		if (response.error) {
			yield put({ type: LOGIN_ERROR, message: response.error.message });
			console.log('login error', response); // eslint-disable-line no-console
		} else {
			yield put({ type: USER_LOGGED_IN, userId: response.user_id });
			yield put(getUserNotes({ userId: response.user_id }));
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// export function* updatePassword() {
// 	const requestUrl = `https://api.bible.build/?key=${process.env.DBP_API_KEY}&v=4&pretty`;

// 	try {
// 		// const response = yield call(request, requestUrl);
// 		//
// 		// yield put('action', response);
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-ignore-line no-console
// 		}
// 	}
// }

// export function* resetPassword() {
// 	const requestUrl = `https://api.bible.build/?key=${process.env.DBP_API_KEY}&v=4&pretty`;

// 	try {
// 		// const response = yield call(request, requestUrl);
// 		//
// 		// yield put('action', response);
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-ignore-line no-console
// 		}
// 	}
// }

// export function* deleteUser({ userId, email, username }) {
// 	const requestUrl = `https://api.bible.build/?key=${process.env.DBP_API_KEY}&v=4&pretty`;

// 	try {
// 		// const response = yield call(request, requestUrl);
// 		//
// 		// yield put('action', response);
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-ignore-line no-console
// 		}
// 	}
// }

// Individual exports for testing
export default function* defaultSaga() {
	// yield takeLatest(GET_USER_DATA, getUserData);
	yield takeLatest(SEND_SIGNUP_FORM, sendSignUpForm);
	yield takeLatest(SEND_LOGIN_FORM, sendLoginForm);
	yield takeLatest(GET_USER_NOTES, getNotes);
	// yield takeLatest(UPDATE_PASSWORD, updatePassword);
	// yield takeLatest(RESET_PASSWORD, resetPassword);
	// yield takeLatest(DELETE_USER, deleteUser);
}
