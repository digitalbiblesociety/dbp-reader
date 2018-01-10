import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
// import fetch from 'whatwg-fetch';
import unionWith from 'lodash/unionWith';
import { GET_CHAPTER_TEXT, GET_BOOKS, GET_AUDIO } from './constants';
import { loadChapter, loadBooksAndCopywrite, loadAudio } from './actions';

export function* getAudio({ list }/* { filesetId, list } */) {
	// Will need to save the cookie returned in the header
	// cookie will be used to set a timeout function to re-request
	// the resource once its time limit has been reached. time is 300s

	// const requestUrl = `https://api.bible.build/bibles/filesets/CHNUNVN2DA?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	const requestUrls = [];
	list.forEach((n, fid) => {
		if (n === 'audio_drama') {
			requestUrls.push(`https://api.bible.build/bibles/filesets/${fid}?key=${process.env.DBP_API_KEY}&v=4&pretty`);
		}
	});

	try {
		// const response = yield call(request, requestUrl);
		// const res2 = yield fetch(`https://api.bible.build/bibles/filesets/CHNUNVN2DA?key=${process.env.DBP_API_KEY}&v=4&pretty`).then(res => res.headers);

		const results = yield (async (urls) => {
			const data = [];
			// Figure out a cleaner way of doing this
			for (const url of urls) { // eslint-disable-line no-restricted-syntax
				const res = await request(url);// eslint-disable-line no-await-in-loop
				data.push(res.data);
			}
			return data;
		})(requestUrls);
		const audioObjects = unionWith(...results, (resource, next) => resource.book_id === next.book_id && resource.chapter_start === next.chapter_start);

		yield put(loadAudio({ audioObjects }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* getBooks({ textId }) {
	// Plain Text -> https://api.bible.build/bibles/${textId}
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
	// TODO: Add ability to make calls for plaintext and formatted text
	const textRequestUrl = `https://api.bible.build/bible/${bible}/${book}/${chapter}?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	// const audioRequestUrl = `https://api.bible.build/bibles/filesets/${filesetId}?key=${process.env.DBP_API_KEY}&v=4&pretty`;

	try {
		const textResponse = yield call(request, textRequestUrl);
		// const audioResponse = yield call(request, audioRequestUrl);

		yield put(loadChapter({ text: textResponse.data }));
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
	yield takeLatest(GET_AUDIO, getAudio);
}
