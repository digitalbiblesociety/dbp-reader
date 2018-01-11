import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import {
	LOAD_USER_DATA,
	USER_LOGGED_IN,
	GET_USER_DATA,
	SEND_LOGIN_FORM,
	SEND_SIGNUP_FORM,
	UPDATE_PASSWORD,
	RESET_PASSWORD,
	DELETE_USER,
} from './constants';

export function* getUserNotes({ userId }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.NODE_ENV}&v=4&pretty`;

	try {
		const response = yield call(request, requestUrl);

		yield put('action', response);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
		}
	}
}

export function* addUserNote({ userId, noteInfo }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.NODE_ENV}&v=4&pretty`;
	const options = {
		body: noteInfo,
		method: 'POST',
	};

	try {
		const response = yield call(request, requestUrl, options);
		console.log('user note response', response);
		yield put('action', response);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
		}
	}
}

export function* getUserData({ userId }) {
	const requestUrl = `https://api.bible.build/users/${userId}?key=${process.env.NODE_ENV}&v=4&pretty`;

	try {
		const response = yield call(request, requestUrl);
		console.log(response);

		yield put(LOAD_USER_DATA, { data: 'data' });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
		}
	}
}

export function* sendSignUpForm({ password, email, username }) {
	const requestUrl = `https://api.bible.build/users?key=${process.env.NODE_ENV}&v=4&pretty`;
	const options = {
		method: 'POST',
		body: {
			password,
			email,
			username,
		},
	};

	try {
		const response = yield call(request, requestUrl, options);
		console.log(response);

		if (response.data.user_id) {
			yield put(USER_LOGGED_IN, response.data.user_id);
		} else {
			yield put('user-login-failed', response);
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
		}
	}
}

export function* sendLoginForm({ password, email, username }) {
	const requestUrl = `https://api.bible.build/users?key=${process.env.NODE_ENV}&v=4&pretty`;
	const options = {
		method: 'POST',
		body: {
			password,
			email,
			username,
		},
	};

	console.log(password, 'password');
	console.log(email, 'email');
	console.log(username, 'username');
	try {
		// const response = yield call(request, requestUrl, options);

		// if (response.data.user_id) {
		// 	yield put(USER_LOGGED_IN, response.data.user_id);
		// } else {
		// 	yield put('user-login-failed', response);
		// }
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
		}
	}
}

export function* updatePassword() {
	const requestUrl = `https://api.bible.build/?key=${process.env.NODE_ENV}&v=4&pretty`;

	try {
		const response = yield call(request, requestUrl);

		yield put('action', response);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
		}
	}
}

export function* resetPassword() {
	const requestUrl = `https://api.bible.build/?key=${process.env.NODE_ENV}&v=4&pretty`;

	try {
		const response = yield call(request, requestUrl);

		yield put('action', response);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
		}
	}
}

export function* deleteUser() {
	const requestUrl = `https://api.bible.build/?key=${process.env.NODE_ENV}&v=4&pretty`;

	try {
		const response = yield call(request, requestUrl);

		yield put('action', response);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
		}
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	yield takeLatest(GET_USER_DATA, getUserData);
	yield takeLatest(SEND_SIGNUP_FORM, sendSignUpForm);
	yield takeLatest(SEND_LOGIN_FORM, sendLoginForm);
	yield takeLatest(UPDATE_PASSWORD, updatePassword);
	yield takeLatest(RESET_PASSWORD, resetPassword);
	yield takeLatest(DELETE_USER, deleteUser);
}
