import 'whatwg-fetch';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import request from 'utils/request';
import { fromJS } from 'immutable';
import unionWith from 'lodash/unionWith';
import { ADD_HIGHLIGHTS, LOAD_HIGHLIGHTS, GET_CHAPTER_TEXT, GET_HIGHLIGHTS, GET_BOOKS, GET_AUDIO, INIT_APPLICATION } from './constants';
import { loadChapter, loadBooksAndCopywrite, loadAudio } from './actions';

export function* initApplication({ activeTextId, iso }) {
	const activeTextUrl = `https://api.bible.build/bibles?key=${process.env.DBP_API_KEY}&v=4&language_code=${iso}`;
	let filesets = {};
	try {
		const response = yield call(request, activeTextUrl);
		const activeText = response.data.filter((text) => text.abbr === activeTextId)[0];

		filesets = fromJS(activeText.filesets || {});
	} catch (err) {
		if (err && process.env.NODE_ENV === 'development') {
			console.log('error in init', err); // eslint-disable-line no-console
		}
	}

	yield getAudio({ list: filesets });
	// yield getBooks({ textId: activeTextId, filesets });
	// get the active text
	// use the fileset list in active text for getAudio call
	// use the text id and the filesets to get a book list
	// use the resulting data to get the chapters
}

// TODO: Fix issue with audio coming back after the chapters have already been called
export function* getAudio({ list }/* { filesetId, list } */) {
	const dramaUrls = [];
	const plainUrls = [];
	// if there is a audio drama version with size code for everything use it
	// same for non drama
	// otherwise get the first version for the nt and the ot
	// last get portions if there is nothing else
	// const allOfDrama = {};
	// const combinedDrama = {};
	// const combinedPlain = {};
	// const allOfPlain = {};
	// const portions = {};
	const generateUrl = (fileId, sizeCode) => ({ sizeCode, fileId, url: `https://api.bible.build/bibles/filesets/${fileId}?key=${process.env.DBP_API_KEY}&v=4` });

	list.forEach((fileObject, fileId) => {
		const type = fileObject.get('set_type_code');
		const sizeCode = fileObject.get('set_size_code');
		// Initial code for making sure I send as few api calls as possible
		// if (type === 'audio_drama' && sizeCode === 'C') {
		// 	allOfDrama[sizeCode] = (generateUrl(fileId, sizeCode));
		// } else if (type === 'audio' && sizeCode === 'C') {
		// 	allOfPlain[sizeCode] = (generateUrl(fileId, sizeCode));
		// } else if (type === 'audio_drama' && (sizeCode === 'OT' || sizeCode === 'NT')) {
		// 	combinedDrama[sizeCode] = (generateUrl(fileId, sizeCode));
		// } else if (type === 'audio' && (sizeCode === 'OT' || sizeCode === 'NT')) {
		// 	combinedPlain[sizeCode] = (generateUrl(fileId, sizeCode));
		// } else if (type === 'audio' && sizeCode.includes('P')) {
		// 	portions[sizeCode] = (generateUrl(fileId, sizeCode));
		// }

		if (type === 'audio_drama') {
			dramaUrls.push(generateUrl(fileId, sizeCode));
		} else if (type === 'audio') {
			plainUrls.push(generateUrl(fileId, sizeCode));
		}
	});
	// console.log('all drama', allOfDrama);
	// console.log('all plain', allOfPlain);
	// console.log('combined drama', combinedDrama);
	// console.log('combined plain', combinedPlain);
	// console.log('portions', portions);

	try {
		const results = [];
		// Figure out a cleaner/faster way of doing this without using for loop
		for (const requestUrl of dramaUrls) { // eslint-disable-line no-restricted-syntax
			const res = yield request(requestUrl.url);
			const data = res.data.map((obj) => ({ bookId: obj.book_id, bookName: obj.book_name, chapter: obj.chapter_start, filesetId: requestUrl.fileId }));
			results.push(data);
		}
		// TODO: Need to get plain audio only for chapters that don't already have audio
		// Currently getting all audio and mashing it together so that most of the chapters have something
		// if (results.length === 0) {
		for (const requestUrl of plainUrls) { // eslint-disable-line no-restricted-syntax
			const res = yield request(requestUrl.url);
			const data = res.data.map((obj) => ({ bookId: obj.book_id, bookName: obj.book_name, chapter: obj.chapter_start, filesetId: requestUrl.fileId }));
			results.push(data);
		}
		// }

		const audioObjects = unionWith(...results, (resource, next) => resource.bookId === next.bookId && resource.chapter === next.chapter);
		yield put(loadAudio({ audioObjects }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* getBooks({ textId, filesets }) {
	// TODO: Should split getting text from the database, getting text from s3 and getting the audio into different sagas
	// Should also find a way of determining which filesets have resources without having to make an api call to each of them
	// This applies both to getting the chapters and getting the books
	// Process should check for formatted text, then audio, then plain text
	const requestUrl = `https://api.bible.build/bibles/${textId}?key=${process.env.DBP_API_KEY}&v=4`;
	// console.log('filesets in get books', filesets)
	try {
		const response = yield call(request, requestUrl);
		const books = response.data.books.map((book) => ({
			...book,
			chapters: book.chapters.sort((a, b) => a - b),
		}));
		const hasTextInDatabase = books.length !== 0;
		const filesetTypes = {};
		const backupBooks = [];
		const urls = [];
		const tempData = [];
		// console.log('at first for each')
		filesets.forEach((fileObject, fileId) => {
			urls.push({ url: `https://api.bible.build/bibles/filesets/${fileId}?key=${process.env.DBP_API_KEY}&v=4`, filesetId: fileId, type: fileObject.get('set_type_code') });
		});
		// console.log('urls', urls);
		for (const url of urls) { // eslint-disable-line no-restricted-syntax
			const res = yield request(url.url);
			if (res.data.length !== 0) {
				filesetTypes[url.type] = url.filesetId;
			}
			const data = res.data.map((obj) => ({ book_id: obj.book_id, name: obj.book_name, name_short: obj.book_name, chapter: obj.chapter_start }));
			tempData.push(data);
		}
		// console.log('temp data', tempData);
		// console.log('filesetTypes', filesetTypes);
		const unitedData = unionWith(...tempData, (resource, next) => resource.book_id === next.book_id && resource.chapter === next.chapter);
		const bookChapterList = unitedData.reduce((list, book) => {
			if (list[book.book_id]) {
				return { ...list, [book.book_id]: { ...list[book.book_id], chapters: list[book.book_id].chapters.concat(book.chapter) } };
			}
			return { ...list, [book.book_id]: { ...book, chapters: [book.chapter] } };
		}, {});

		Object.values(bookChapterList).forEach((value) => backupBooks.push(value));

		const copywrite = {
			mark: response.data.mark,
			name: response.data.name,
			date: response.data.date,
			country: response.data.country,
		};
		// console.log('loading books')
		// eventually store a key value pair for each type of resource available
		// console.log('filesetTypes in get books', filesetTypes);
		yield put(loadBooksAndCopywrite({ books: hasTextInDatabase ? books : backupBooks, copywrite, hasTextInDatabase, filesetTypes }));
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* getChapter({ bible, book, chapter, audioObjects, hasTextInDatabase, formattedText, userAuthenticated, userId }) {
	// console.log('user id and auth in get chapter', userId, 'auth', userAuthenticated);
	// TODO Split these calls into separate functions to reduce wait time for a user
	// Add ability to make calls for plaintext and formatted text
	// There is an issue with the getAudio call not returning before this call
	// there needs to be some sort of race, or variable that tracks whether or
	// not the filesets have been retrieved and the audioObjects have been set
	// console.log('formatted text in get chapters', formattedText);
	// console.log('before yield all')
	const [text, audioSource, formattedSource] = yield all([
		call(getPlainText, { hasTextInDatabase, bible, book, chapter }),
		call(getAudioSource, { audioObjects, book, chapter }),
		call(getFormattedText, { formattedText, chapter, book }),
	]);
	let highlights = [];

	if (userAuthenticated) {
		highlights = yield call(getHighlights, { bible, book, chapter, userId, fromChapter: true });
	}
	// console.log('after yield all, should have been a few seconds at least')
	// const text = yield* getPlainText({ hasTextInDatabase, bible, book, chapter });
	// const audioSource = yield* getAudioSource({ audioObjects, book, chapter });
	// const formattedSource = yield* getFormattedText({ formattedText, chapter, book });
	// const audioRequestUrl = `https://api.bible.build/bibles/filesets/${filesetId}?key=${process.env.DBP_API_KEY}&v=4`;
	yield put(loadChapter({ text, audioSource, formattedSource, highlights }));
}

export function* getHighlights({ bible, book, chapter, userId, fromChapter }) {
	const requestUrl = `https://api.bible.build/users/${userId}/highlights?key=${process.env.DBP_API_KEY}&v=4&bible_id=${bible}&book_id=${book}&chapter=${chapter}`;
	let highlights = [];

	try {
		const response = yield call(request, requestUrl);
		if (response.data) {
			highlights = response.data;
		}
		if (!fromChapter) {
			yield put({ type: LOAD_HIGHLIGHTS, highlights });
		}
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in highlights request', error); // eslint-disable-line no-console
		}
	}
	return highlights;
}

export function* getPlainText({ hasTextInDatabase, bible, book, chapter }) {
	let textRequestUrl = '';
	let plainText = [];

	if (hasTextInDatabase) {
		textRequestUrl = `https://api.bible.build/bibles/${bible}/${book}/${chapter}?key=${process.env.DBP_API_KEY}&v=4`;
	}

	try {
		const plainTextResponse = yield textRequestUrl ? call(request, textRequestUrl) : [];
		// console.log('plain text response', plainTextResponse);
		if (plainTextResponse.data) {
			plainText = plainTextResponse.data;
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in database text request', err); // eslint-disable-line no-console
		}
	}
	return plainText;
}

export function* getFormattedText({ formattedText, chapter, book }) {
	let formattedTextRequestUrl = '';
	let formattedSource = '';

	if (formattedText) {
		formattedTextRequestUrl = `https://api.bible.build/bibles/filesets/${formattedText}?chapter_id=${chapter}&book_id=${book}&key=${process.env.DBP_API_KEY}&v=4`;
	}

	try {
		const formattedResponse = yield formattedTextRequestUrl ? call(request, formattedTextRequestUrl) : '';

		if (formattedResponse) {
			formattedSource = yield fetch(formattedResponse.data[0].path).then((res) => res.text());
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in formatted request', err); // eslint-disable-line no-console
		}
	}
	return formattedSource;
}

export function* getAudioSource({ audioObjects, book, chapter }) {
	const audio = typeof audioObjects.toJS === 'function' ? audioObjects.toJS() : audioObjects;
	const hasAudio = audio.filter((resource) => resource.bookId === book && resource.chapter === chapter);
	let audioRequestUrl = '';
	let audioSource = '';

	if (hasAudio.length) {
		audioRequestUrl = `https://api.bible.build/bibles/filesets/${hasAudio[0].filesetId}?chapter_id=${chapter}&book_id=${book}&key=${process.env.DBP_API_KEY}&v=4`;
	}

	try {
		const audioResponse = yield audioRequestUrl ? call(request, audioRequestUrl) : '';

		audioSource = audioResponse ? audioResponse.data[0].path : '';
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in audio request', err); // eslint-disable-line no-console
		}
	}
	return audioSource;
}

export function* addHighlight({ bible, book, chapter, userId, verseStart, highlightStart, highlightedWords }) {
	const requestUrl = `https://api.bible.build/users/${userId}/highlights?key=${process.env.DBP_API_KEY}&v=4&bible_id=${bible}&book_id=${book}&chapter=${chapter}`;
	const formData = new FormData();
	let highlights = [];
	formData.append('book_id', book);
	formData.append('user_id', userId);
	formData.append('bible_id', bible);
	formData.append('chapter', chapter);
	formData.append('verse_start', verseStart);
	formData.append('highlight_start', highlightStart);
	formData.append('highlighted_words', highlightedWords);

	const options = {
		method: 'POST',
		body: formData,
	};

	try {
		const response = yield call(request, requestUrl, options);
		if (response.data) {
			highlights = response.data;
		}

		yield put({ type: LOAD_HIGHLIGHTS, highlights });
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in highlights request', error); // eslint-disable-line no-console
		}
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	yield takeLatest(INIT_APPLICATION, initApplication);
	yield takeLatest(GET_AUDIO, getAudio);
	yield takeLatest(GET_BOOKS, getBooks);
	yield takeLatest(GET_CHAPTER_TEXT, getChapter);
	yield takeLatest(GET_HIGHLIGHTS, getHighlights);
	yield takeLatest(ADD_HIGHLIGHTS, addHighlight);
}
