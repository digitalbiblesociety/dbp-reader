import { takeLatest, call, put } from 'redux-saga/effects';
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
		// const response = yield call(request, requestUrl, options);
		// console.log('user note response', response);
		// yield put('action', response);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
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
		// const response = yield call(request, requestUrl, options);
		// console.log('user note response', response);
		// yield put('action', response);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
		}
	}
}

export function* addNote({ userId, data }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.NODE_ENV}&v=4&pretty`;
	const options = {
		body: data,
		method: 'POST',
	};

	try {
		// const response = yield call(request, requestUrl, options);
		// console.log('user note response', response);
		// yield put('action', response);
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-ignore-line no-console
		}
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	yield takeLatest(ADD_NOTE, addNote);
	yield takeLatest(ADD_HIGHLIGHT, addHighlight);
	yield takeLatest(ADD_BOOKMARK, addBookmark);
}
