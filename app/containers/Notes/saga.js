import { take, cancel, takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
	ADD_NOTE,
	ADD_HIGHLIGHT,
	ADD_BOOKMARK,
	ADD_NOTE_SUCCESS,
	LOAD_USER_NOTES,
	GET_USER_NOTES,
} from './constants';

export function* getNotes({ userId, params = {} }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	Object.entries(params).forEach((param) => requestUrl.concat(`&${param[0]}=${param[1]}`));

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

export function* addBookmark({ userId, data }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	const options = {
		body: data,
		method: 'POST',
	};

	try {
		const response = yield call(request, requestUrl, options);
		console.log('user note response', response);  // eslint-disable-line no-console
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* addHighlight({ userId, data }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	const options = {
		body: data,
		method: 'POST',
	};

	try {
		const response = yield call(request, requestUrl, options);
		console.log('user note response', response); // eslint-disable-line no-console
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* addNote({ userId, data }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	const formData = new FormData();

	Object.entries(data).forEach((item) => formData.set(item[0], item[1]));

	const options = {
		body: formData,
		method: 'POST',
	};

	try {
		const response = yield call(request, requestUrl, options);
		console.log('user note response', response); // eslint-disable-line no-console
		if (response.success) {
			yield put({ type: ADD_NOTE_SUCCESS, response });
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	const addNoteSaga = yield takeLatest(ADD_NOTE, addNote);
	const addHighlightSaga = yield takeLatest(ADD_HIGHLIGHT, addHighlight);
	const addBookmarkSaga = yield takeLatest(ADD_BOOKMARK, addBookmark);
	const getNotesSaga = yield takeLatest(GET_USER_NOTES, getNotes);

	yield take(LOCATION_CHANGE);
	yield cancel(addNoteSaga);
	yield cancel(addHighlightSaga);
	yield cancel(addBookmarkSaga);
	yield cancel(getNotesSaga);
}
