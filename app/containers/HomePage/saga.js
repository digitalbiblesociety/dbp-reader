import { takeLatest, call, put } from 'redux-saga/effects';
import request from 'utils/request';
import unionWith from 'lodash/unionWith';
import { GET_CHAPTER_TEXT, GET_BOOKS, GET_AUDIO } from './constants';
import { loadChapter, loadBooksAndCopywrite, loadAudio } from './actions';

// TODO: Fix issue with audio coming back after the chapters have already been called
export function* getAudio({ list }/* { filesetId, list } */) {
	const dramaUrls = [];
	const plainUrls = [];
	list.forEach((fileObject, fileId) => {
		if (fileObject.get('set_type') === 'audio_drama') {
			dramaUrls.push({ fileId, url: `https://api.bible.build/bibles/filesets/${fileId}?key=${process.env.DBP_API_KEY}&v=4` });
		} else if (fileObject.get('set_type') === 'audio') {
			plainUrls.push({ fileId, url: `https://api.bible.build/bibles/filesets/${fileId}?key=${process.env.DBP_API_KEY}&v=4` });
		}
	});

	try {
		const results = [];
		// Figure out a cleaner/faster way of doing this without using for loop
		for (const requestUrl of dramaUrls) { // eslint-disable-line no-restricted-syntax
			const res = yield request(requestUrl.url);
			const data = res.data.map((obj) => ({ bookId: obj.book_id, bookName: obj.book_name, chapter: obj.chapter_start, filesetId: requestUrl.fileId }));
			results.push(data);
		}

		if (results.length === 0) {
			for (const requestUrl of plainUrls) { // eslint-disable-line no-restricted-syntax
				const res = yield request(requestUrl.url);
				const data = res.data.map((obj) => ({ bookId: obj.book_id, bookName: obj.book_name, chapter: obj.chapter_start, filesetId: requestUrl.fileId }));
				results.push(data);
			}
		}

		const audioObjects = unionWith(...results, (resource, next) => resource.bookId === next.bookId && resource.chapter === next.chapter);

		yield put(loadAudio({ audioObjects }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* getBooks({ textId, filesets }) {
	// Plain Text -> https://api.bible.build/bibles/${textId}
	const requestUrl = `https://api.bible.build/bibles/${textId}?key=${process.env.DBP_API_KEY}&v=4`;

	try {
		const response = yield call(request, requestUrl);
		const books = response.data.books.map((book) => ({
			...book,
			chapters: book.chapters.split(',').map(Number).sort((a, b) => a - b),
		}));
		const hasTextInDatabase = books.length !== 0;
		const filesetTypes = {};
		const backupBooks = [];

		if (!hasTextInDatabase) {
			const urls = [];
			const tempData = [];
			filesets.forEach((fileObject, fileId) => {
				urls.push({ url: `https://api.bible.build/bibles/filesets/${fileId}?key=${process.env.DBP_API_KEY}&v=4`, filesetId: fileId, type: fileObject.get('set_type') });
			});

			for (const url of urls) { // eslint-disable-line no-restricted-syntax
				const res = yield request(url.url);
				if (res.data.length !== 0) {
					filesetTypes[url.type] = true;
				}
				const data = res.data.map((obj) => ({ book_id: obj.book_id, name: obj.book_name, name_short: obj.book_name, chapter: obj.chapter_start }));
				tempData.push(data);
			}

			const unitedData = unionWith(...tempData, (resource, next) => resource.book_id === next.book_id && resource.chapter === next.chapter);
			const bookChapterList = unitedData.reduce((list, book) => {
				if (list[book.book_id]) {
					return { ...list, [book.book_id]: { ...list[book.book_id], chapters: list[book.book_id].chapters.concat(book.chapter) } };
				}
				return { ...list, [book.book_id]: { ...book, chapters: [book.chapter] } };
			}, {});

			Object.values(bookChapterList).forEach((value) => backupBooks.push(value));
		}

		const copywrite = {
			mark: response.data.mark,
			name: response.data.name,
			date: response.data.date,
			country: response.data.country,
		};

		yield put(loadBooksAndCopywrite({ books: hasTextInDatabase ? books : backupBooks, copywrite, hasTextInDatabase, filesetTypes }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* getChapter({ bible, book, chapter, audioObjects, hasTextInDatabase }) {
	const audio = typeof audioObjects.toJS === 'function' ? audioObjects.toJS() : audioObjects;
	const hasAudio = audio.filter((resource) => resource.bookId === book && resource.chapter === chapter);
	let audioRequestUrl = '';
	let textRequestUrl = '';
	// TODO
	// Add ability to make calls for plaintext and formatted text
	// There is an issue with the getAudio call not returning before this call
	// there needs to be some sort of race, or variable that tracks whether or
	// not the filesets have been retrieved and the audioObjects have been set
	if (hasAudio.length) {
		audioRequestUrl = `https://api.bible.build/bibles/filesets/${hasAudio[0].filesetId}?chapter_id=${chapter}&book_id=${book}&key=${process.env.DBP_API_KEY}&v=4`;
	}

	if (hasTextInDatabase) {
		textRequestUrl = `https://api.bible.build/bible/${bible}/${book}/${chapter}?key=${process.env.DBP_API_KEY}&v=4`;
	}
	// const audioRequestUrl = `https://api.bible.build/bibles/filesets/${filesetId}?key=${process.env.DBP_API_KEY}&v=4`;

	try {
		const textResponse = yield textRequestUrl ? call(request, textRequestUrl) : '';
		const audioResponse = yield audioRequestUrl ? call(request, audioRequestUrl) : '';
		const text = textResponse || [];
		const audioSource = audioResponse ? audioResponse.data[0].path : '';

		yield put(loadChapter({ text, audioSource }));
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
