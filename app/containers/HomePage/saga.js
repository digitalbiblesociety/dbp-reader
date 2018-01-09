import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import { GET_CHAPTER_TEXT, GET_BOOKS, GET_AUDIO } from './constants';
import { loadChapter, loadBooksAndCopywrite, loadAudio } from './actions';

export function* getAudio({ filesetId, list }) {
	// console.log('this is the fileset id', filesetId);
	// console.log('list', list);

	let requestUrl = `https://api.bible.build/bibles/filesets/CHNUNVN2DA?key=${process.env.DBP_API_KEY}&v=4&pretty`
	// const requestUrls = [];
	// list.forEach((n, fid) => requestUrls.push(`https://api.bible.build/bibles/filesets/${fid}?key=${process.env.DBP_API_KEY}&v=4&pretty`));
	// console.log(requestUrls);
	try {
		const response = yield call(request, requestUrl);
		console.log(response);
		// const results = yield (async (urls) => {
		// 	const data = {};
		// 	await urls.forEach(async (url, k) => {
		// 		const res = await request(url);
		// 		data[k] = res.data;
		// 	});
		// 	return data;
		// })(requestUrls);
		// console.log(results);
		yield put(loadAudio({ audioObjects: response.data }));
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
