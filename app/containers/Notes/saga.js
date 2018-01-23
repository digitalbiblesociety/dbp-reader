import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import {
	ADD_NOTE,
	ADD_HIGHLIGHT,
	ADD_BOOKMARK,
} from './constants';

export function* addBookmark({ userId, data }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.NODE_ENV}&v=4&pretty`;
	const options = {
		body: data,
		method: 'POST',
	};

	try {
		const response = yield call(request, requestUrl, options);
		console.log('user note response', response);  // eslint-disable-line no-console
		yield put('action', response);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* addHighlight({ userId, data }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.NODE_ENV}&v=4&pretty`;
	const options = {
		body: data,
		method: 'POST',
	};

	try {
		const response = yield call(request, requestUrl, options);
		console.log('user note response', response); // eslint-disable-line no-console
		yield put('action', response);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* addNote({ userId, data }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.NODE_ENV}&v=4&pretty`;
	const formData = new FormData();

	data.forEach((piece, key) => formData.append(key, piece));

	const options = {
		body: formData,
		method: 'POST',
	};

	try {
		const response = yield call(request, requestUrl, options);
		console.log('user note response', response); // eslint-disable-line no-console
		if (response.success) {
			yield put('action', response);
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	yield takeLatest(ADD_NOTE, addNote);
	yield takeLatest(ADD_HIGHLIGHT, addHighlight);
	yield takeLatest(ADD_BOOKMARK, addBookmark);
}
