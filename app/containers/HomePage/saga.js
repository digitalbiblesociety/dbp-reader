import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_CHAPTER_TEXT, GET_BOOKS } from './constants';
import { loadChapter, loadBooksAndCopywrite } from './actions';

export function* getBooks({ textId }) {
	const requestUrl = `https://api.bible.build/bibles/${textId}?key=${process.env.DBP_API_KEY}&v=4&pretty`;

	try {
		const response = yield call(request, requestUrl);
		const books = response.data.books.map((book) => ({
			...book,
			chapters: book.chapters.split(',').map(Number).sort((a, b) => a - b),
		}));
		const copywrite = {
			mark: response.data.mark,
			name: response.data.name,
			date: response.data.date,
			country: response.data.country,
		};

		yield put(loadBooksAndCopywrite({ books, copywrite }));
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
	yield takeLatest(GET_CHAPTER_TEXT, getChapter);
	yield takeLatest(GET_BOOKS, getBooks);
}
