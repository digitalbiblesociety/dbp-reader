import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import unionWith from 'lodash/unionWith';
import { GET_CHAPTER_TEXT, GET_BOOKS, GET_AUDIO } from './constants';
import { loadChapter, loadBooksAndCopywrite, loadAudio } from './actions';

export function* getAudio({ list }/* { filesetId, list } */) {
	const requestUrls = [];
	list.forEach((type, fileId) => {
		if (type === 'audio_drama') {
			requestUrls.push({ fileId, url: `https://api.bible.build/bibles/filesets/${fileId}?key=${process.env.DBP_API_KEY}&v=4&pretty` });
		}
	});
	console.log(list)
	try {
		const results = [];
		// Figure out a cleaner/faster way of doing this without using for loop
		for (const requestUrl of requestUrls) { // eslint-disable-line no-restricted-syntax
			const res = yield request(requestUrl.url);
			const data = res.data.map((obj) => ({ bookId: obj.book_id, bookName: obj.book_name, chapter: obj.chapter_start, filesetId: requestUrl.fileId }))
			results.push(data);
		}
		console.log(results)
		const audioObjects = unionWith(...results, (resource, next) => resource.bookId === next.bookId && resource.chapter === next.chapter);
		console.log(audioObjects);
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

export function* getChapter({ bible, book, chapter, audioObjects }) {
	const hasAudio = audioObjects.filter((resource) => resource[book] && resource[chapter]);
	// TODO: Add ability to make calls for plaintext and formatted text
	let audioRequestUrl = '';

	if (hasAudio.length) {
		audioRequestUrl = `https://api.bible.build/bibles/filesets/${hasAudio[0].filesetId}?chapter_id=${chapter}&book_id=${book}&key=${process.env.DBP_API_KEY}&v=4&pretty`;
	}

	const textRequestUrl = `https://api.bible.build/bible/${bible}/${book}/${chapter}?key=${process.env.DBP_API_KEY}&v=4&pretty`;
	// const audioRequestUrl = `https://api.bible.build/bibles/filesets/${filesetId}?key=${process.env.DBP_API_KEY}&v=4&pretty`;

	try {
		const textResponse = yield call(request, textRequestUrl);
		const audioResponse = yield audioRequestUrl ? call(request, audioRequestUrl) : '';
		let audioSource = '';

		if (audioResponse) {
			audioSource = audioResponse.data[0].path;
		}
		console.log(audioSource)
		yield put(loadChapter({ text: textResponse.data, audioSource }));
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
