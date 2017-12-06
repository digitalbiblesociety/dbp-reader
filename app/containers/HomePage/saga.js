import { take, takeLatest, cancel, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { LOCATION_CHANGE } from 'react-router-redux';
import { GET_DPB_TEXTS, GET_BOOKS } from './constants';
import { loadTexts, loadBooks } from './actions';

export function* getTexts() {
	// need to configure the correct request url as this one is not getting a response
	const requestUrl = `https://api.bible.build/bibles?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	try {
		const response = yield call(request, requestUrl);

		yield put(loadTexts({ texts: response.data }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* getBooks({ textId }) {
	const requestUrl = `https://api.bible.build/bibles/${textId}?key=${process.env.DBP_API_KEY}&v=4&pretty`;

	try {
		const response = yield call(request, requestUrl);
		const books = response.data.books.map((book) => ({
			...book,
			chapters: book.chapters.split(',').map(Number),
		}));

		yield put(loadBooks({ books }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	const watchTextsRequest = yield takeLatest(GET_DPB_TEXTS, getTexts);
	const watchBooksRequest = yield takeLatest(GET_BOOKS, getBooks);

	yield take(LOCATION_CHANGE);
	yield cancel(watchBooksRequest);
	yield cancel(watchTextsRequest);
}
