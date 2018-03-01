import 'whatwg-fetch';
import { takeLatest, call, put, all } from 'redux-saga/effects';
import request from 'utils/request';
import { fromJS } from 'immutable';
import unionWith from 'lodash/unionWith';
import some from 'lodash/some';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
// import { ADD_HIGHLIGHTS, LOAD_HIGHLIGHTS, GET_CHAPTER_TEXT, GET_HIGHLIGHTS, GET_BOOKS, GET_AUDIO, INIT_APPLICATION } from './constants';
import { ADD_HIGHLIGHTS, LOAD_HIGHLIGHTS, GET_HIGHLIGHTS } from './constants';
import { loadChapter, loadBooksAndCopywrite, loadAudio } from './actions';

const testEsvFiles = {
	ENGESVN1DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio',
		set_size_code: 'NT',
		meta: [],
	},
	ENGGIDO1DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio',
		set_size_code: 'OT',
		meta: [],
	},
	ENGESVN2DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio_drama',
		set_size_code: 'NT',
		meta: [],
	},
	ENGGIDO2DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio_drama',
		set_size_code: 'OT',
		meta: [],
	},
	ENGESVO2DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio_drama',
		set_size_code: 'OT',
		meta: [],
	},
	ENGESVT2DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio_drama',
		set_size_code: 'NT',
		meta: [],
	},
	ENGESVC2DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio_drama',
		set_size_code: 'C',
		meta: [],
	},
	ENGGIDN2DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio_drama',
		set_size_code: 'NT',
		meta: [],
	},
	ENGESVO1DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio',
		set_size_code: 'OT',
		meta: [],
	},
	ENGGIDN1DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio',
		set_size_code: 'NT',
		meta: [],
	},
};

const testKjvFiles = {
	ENGKJVN1DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio',
		set_size_code: 'NT',
		meta: [],
	},
	ENGKJVC1DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio',
		set_size_code: 'C',
		meta: [],
	},
	ENGKJVO1DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio',
		set_size_code: 'OT',
		meta: [],
	},
	ENGKJVO2DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio_drama',
		set_size_code: 'OT',
		meta: [],
	},
	ENGKJVN2DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio_drama',
		set_size_code: 'NT',
		meta: [],
	},
	ENGKJVC2DA: {
		bucket_id: 'dbp-dev',
		set_type_code: 'audio_drama',
		set_size_code: 'C',
		meta: [],
	},
	ENGKJV: {
		bucket_id: 'dbs-web',
		set_type_code: 'text_formatt',
		set_size_code: 'C',
		meta: [],
	},
};

export function* initApplication({ activeTextId }) {
	// This will always have to request the full list of versions because the url will not contain language information
	const activeTextUrl = `https://api.bible.build/bibles?key=${process.env.DBP_API_KEY}&v=4`;
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
	// temporary fix for if the list comes back undefined
	if (!list) {
		return;
	}
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

export function* getBooks({ textId, filesets, activeBookId }) {
	// TODO: Should split getting text from the database, getting text from s3 and getting the audio into different sagas
	// Should also find a way of determining which filesets have resources without having to make an api call to each of them
	// This applies both to getting the chapters and getting the books
	// Process should check for formatted text, then audio, then plain text
	const requestUrl = `https://api.bible.build/bibles/${textId}?key=${process.env.DBP_API_KEY}&v=4`;

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

		filesets.forEach((fileObject, fileId) => {
			urls.push({ url: `https://api.bible.build/bibles/filesets/${fileId}?key=${process.env.DBP_API_KEY}&v=4`, filesetId: fileId, type: fileObject.get('set_type_code') });
		});

		for (const url of urls) { // eslint-disable-line no-restricted-syntax
			// Fix this to not be so gross................
			const res = yield request(url.url);
			if (res.data.length !== 0) {
				filesetTypes[url.type] = url.filesetId;
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

		const copywrite = {
			mark: response.data.mark,
			name: response.data.name,
			date: response.data.date,
			country: response.data.country,
		};
		// Setting the active book here based on the bookId provided in the url
		// Need to also account for setting the book id here
		const activeBook = hasTextInDatabase ? books.find((book) => book.book_id === activeBookId) : backupBooks.find((book) => book.book_id === activeBookId);
		// eventually store a key value pair for each type of resource available
		yield put(loadBooksAndCopywrite({
			books: hasTextInDatabase ? books : backupBooks,
			copywrite,
			hasTextInDatabase,
			filesetTypes,
			activeBookName: activeBook ? activeBook.name_short || activeBook.book_name : '',
		}));
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

export function* getBibleFromUrl({ bibleId: oldBibleId, bookId: oldBookId, chapter }) {
	// This function needs to return the data listed below
	// Books
	// Active or first chapter text
	// Active or first chapter audio
	// Bible name
	// Bible id
	// todo Use other methods combined with the ones below to validate the url before try to use it in saga
	const bibleId = oldBibleId.toUpperCase();
	const bookId = oldBookId.toUpperCase();
	const requestUrl = `https://api.bible.build/bibles/${bibleId}?key=${process.env.DBP_API_KEY}&v=4`;
	// Probably need to do stuff here to get the audio and text for this new bible
	try {
		const response = yield call(request, requestUrl);
		let filesets;
		// todo This can be removed once the filesets have been added to the default route
		if (!response.data.filesets) {
			const bibleUrl = `https://api.bible.build/bibles?key=${process.env.DBP_API_KEY}&v=4&language_code=${response.data.iso}`;
			const allBibles = yield call(request, bibleUrl);
			// console.log('all bibles in language', allBibles);
			const activeBible = allBibles.data.find((bible) => bible.abbr === bibleId) || {};
			filesets = activeBible.filesets;
		}
		// console.log('bible response', response);
		if (response.data && Object.keys(response.data).length) {
			// Creating new objects for each set of data needed to ensure I don't forget something
			// I probably will want to use 'yield all' for getting the audio and text so they can be run async
			const bible = response.data;
			const books = bible.books; // Need to ensure that I have the books here
			// console.log('books in new bible', books);
			const activeBook = books.find((b) => b.book_id === bookId);
			// console.log('active book', activeBook);
			const activeChapter = activeBook ? parseInt(chapter, 10) : 1;
			const activeBookId = activeBook ? activeBook.book_id : get(books, [0, 'book_id'], '');
			const activeBookName = activeBook ? activeBook.name_short : get(books, [0, 'name_short'], '');
			// calling a generator that will handle the api requests for getting text
			const chapterData = yield call(getChapterFromUrl, {
				filesets: filesets || (bibleId === 'ENGESV' ? testEsvFiles : testKjvFiles),
				bibleId,
				bookId: activeBookId,
				chapter: activeChapter,
			});
			// console.log('chapter data', chapterData);
			// still need to include to active book name so that iteration happens here
			yield put({
				type: 'loadbible',
				filesets: bible.filesets || filesets,
				name: bible.vname || bible.name,
				iso: bible.iso,
				books,
				chapterData,
				bibleId,
				activeBookId,
				activeChapter,
				activeBookName,
			});
		} else {
			yield put({ type: 'loadbibleerror' });
		}
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in get bible', error); // eslint-disable-line no-console
		}
	}
}

export function* getChapterFromUrl({ filesets, bibleId, bookId, chapter }) {
	// console.log('bible, book, chapter', bibleId, bookId, chapter);
	// console.log('filesets', filesets);
	const hasFormattedText = some(filesets, (f) => f.set_type_code === 'text_formatt');
	// checking for audio but not fetching it as a part of this saga
	const hasAudio = some(filesets, (f) => f.set_type_code === 'audio' || f.set_type_code === 'audio_drama');

	try {
		let formattedText = '';
		let plainText = [];
		let hasPlainText = true;

		// Try to get the formatted text if it is available
		if (hasFormattedText) {
			try {
				// Gets the last fileset id for a formatted text
				const filesetId = reduce(filesets, (a, c, i) => c.set_type_code === 'text_formatt' ? i : a, '');
				const reqUrl = `https://api.bible.build/bibles/filesets/${filesetId}?key=${process.env.DBP_API_KEY}&v=4&book_id=${bookId}&chapter_id=${chapter}`;
				const formattedChapterObject = yield call(request, reqUrl);
				// console.log('response for formatted text', res);
				formattedText = yield fetch(get(formattedChapterObject.data, [0, 'path'], '')).then((res) => res.text());
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.error('Caught in get formatted text block', error); // eslint-disable-line no-console
				}
			}
		}

		// Try to get the plain text every time
		// When this fails it should fail gracefully and not cause anything to break
		try {
			const reqUrl = `https://api.bible.build/bibles/${bibleId}/${bookId}/${chapter}?key=${process.env.DBP_API_KEY}&v=4&book_id=${bookId}&chapter_id=${chapter}`;
			const res = yield call(request, reqUrl);
			// console.log('response for plain text', res);
			plainText = res.data;
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in get plain text block', error); // eslint-disable-line no-console
			}
			hasPlainText = false;
		}

		// console.log('plain text array', plainText);
		// console.log('formatted text array', formattedText);
		// Building response with all the needed data for a chapter to be usable
		yield put({
			type: 'loadnewchapter',
			plainText,
			formattedText,
			hasPlainText,
			hasFormattedText,
			hasAudio,
		});
		return {
			plainText,
			formattedText,
			hasPlainText,
			hasFormattedText,
			hasAudio,
		};
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in get chapter from url', error); // eslint-disable-line no-console
		}
	}

	// Return a default object in the case that none of the api calls work
	return {
		plainText: [],
		formattedText: '',
		hasFormattedText: false,
		hasPlainText: false,
		hasAudio: false,
	};
}

// Individual exports for testing
export default function* defaultSaga() {
	// yield takeLatest(INIT_APPLICATION, initApplication);
	// yield takeLatest(GET_AUDIO, getAudio);
	// yield takeLatest(GET_BOOKS, getBooks);
	// yield takeLatest(GET_CHAPTER_TEXT, getChapter);
	yield takeLatest('getchapter', getChapterFromUrl);
	yield takeLatest(GET_HIGHLIGHTS, getHighlights);
	yield takeLatest(ADD_HIGHLIGHTS, addHighlight);
	yield takeLatest('getbible', getBibleFromUrl);
}
