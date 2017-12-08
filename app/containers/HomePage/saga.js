import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_DPB_TEXTS, GET_BOOKS, GET_CHAPTER_TEXT } from './constants';
import { loadTexts, loadBooks, loadChapter } from './actions';

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

export function* getChapter({ bible, book, chapter }) {
	const requestUrl = `https://api.bible.build/bible/${bible}/${book}/${chapter}?key=${process.env.DBP_API_KEY}&v=4&pretty`;

	try {
		const response = yield call(request, requestUrl);

		yield put(loadChapter({ text: response.data }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	yield takeLatest(GET_DPB_TEXTS, getTexts);
	yield takeLatest(GET_BOOKS, getBooks);
	yield takeLatest(GET_CHAPTER_TEXT, getChapter);
}
