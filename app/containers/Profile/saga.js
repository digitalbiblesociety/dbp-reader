import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import {
	// GET_USER_DATA,
	// LOAD_USER_DATA,
	LOGIN_ERROR,
	USER_LOGGED_IN,
	SEND_LOGIN_FORM,
	SIGNUP_ERROR,
	SEND_SIGNUP_FORM,
	SOCIAL_MEDIA_LOGIN,
	SOCIAL_MEDIA_LOGIN_SUCCESS,
	DELETE_USER,
	// RESET_PASSWORD,
	UPDATE_EMAIL,
	UPDATE_PASSWORD,
	UPDATE_USER_INFORMATION,
} from './constants';

// export function* getUserData({ userId }) {
// 	const highlightsRequestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.DBP_API_KEY}&v=4&pretty`;
// 	const notesRequestUrl = `https://api.bible.build/users/${userId}/highlights?key=${process.env.DBP_API_KEY}&v=4&pretty`;
//
// 	try {
// 		const highlightsResponse = yield call(request, highlightsRequestUrl);
// 		const notesResponse = yield call(request, notesRequestUrl);
// 		console.log(notesResponse);
// 		console.log(highlightsResponse);
// 		const data = {};
// 		if (highlightsResponse.error) {
// 			console.log('error getting highlights', highlightsResponse.error); // eslint-disable-line no-console
// 		} else {
// 			data.highlights = highlightsResponse;
// 		}
// 		yield put({ type: LOAD_USER_DATA, data });
// 		//
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-disable-line no-console
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

		if (response.success) {
			yield put({ type: USER_LOGGED_IN, userId: response.user_id });
		} else if (response.error) {
			const message = Object.values(response.error.message).reduce((acc, cur) => acc.concat(cur), '');
			yield put({ type: SIGNUP_ERROR, message });
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

		if (response.error) {
			yield put({ type: LOGIN_ERROR, message: response.error.message });
		} else {
			yield put({ type: USER_LOGGED_IN, userId: response.user_id });
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* updateEmail({ userId, email }) {
	// console.log('in update email with ', userId, email);
	const requestUrl = `https://api.bible.build/users/${userId}?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	const formData = new FormData();

	formData.append('email', email);

	const options = {
		method: 'PUT',
		body: formData,
	};

	try {
		const response = yield call(request, requestUrl, options);
		// console.log('update email response', response);
		yield put({ type: 'UPDATE_EMAIL_SUCCESS', response });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* updateUserInformation({ userId, profile }) {
	// console.log('in update profile with ', userId, profile);
	const requestUrl = `https://api.bible.build/users/${userId}?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	const formData = new FormData();
	Object.entries(profile).forEach((entry) => entry[1] && formData.set(entry[0], entry[1]));

	const options = {
		method: 'PUT',
		body: formData,
	};

	try {
		const response = yield call(request, requestUrl, options);
		// console.log('update profile response', response);
		yield put({ type: 'UPDATE_EMAIL_SUCCESS', response });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* updatePassword({ userId, password }) {
	// console.log('in update password with ', userId, password);
	const requestUrl = `https://api.bible.build/users/${userId}?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	const formData = new FormData();

	formData.append('password', password);

	const options = {
		method: 'PUT',
		body: formData,
	};

	try {
		const response = yield call(request, requestUrl, options);
		// console.log('update password response', response);
		yield put({ type: 'UPDATE_EMAIL_SUCCESS', response });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// export function* resetPassword() {
// 	const requestUrl = `https://api.bible.build/?key=${process.env.DBP_API_KEY}&v=4&pretty`;

// 	try {
// 		// const response = yield call(request, requestUrl);
// 		//
// 		// yield put('action', response);
// 	} catch (err) {
// 		if (process.env.NODE_ENV === 'development') {
// 			console.error(err); // eslint-disable-line no-console
// 		}
// 	}
// }

export function* deleteUser({ userId }) {
	// console.log('in delete user with id', userId);
	const requestUrl = `https://api.bible.build/users/${userId}?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	const options = {
		method: 'DELETE',
	};

	try {
		const response = yield call(request, requestUrl, options);

		// console.log(response);
		yield put({ type: 'DELETE_USER_SUCCESS', response });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* socialMediaLogin({ driver }) {
	// const {
	// 	name,
	// 	email,
	// 	picture,
	// 	id,
	// 	accessToken,
	// } = res;
	const requestUrl = `https://api.bible.build/users/login/${driver}?key=${process.env.DBP_API_KEY}&v=4`;

	try {
		const response = yield call(request, requestUrl);
		// console.log('social response', response);
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
	// yield takeLatest(GET_USER_DATA, getUserData);
	yield takeLatest(SEND_SIGNUP_FORM, sendSignUpForm);
	yield takeLatest(SEND_LOGIN_FORM, sendLoginForm);
	yield takeLatest(UPDATE_PASSWORD, updatePassword);
	// yield takeLatest(RESET_PASSWORD, resetPassword);
	yield takeLatest(DELETE_USER, deleteUser);
	yield takeLatest(UPDATE_USER_INFORMATION, updateUserInformation);
	yield takeLatest(UPDATE_EMAIL, updateEmail);
	yield takeLatest(SOCIAL_MEDIA_LOGIN, socialMediaLogin);
}
