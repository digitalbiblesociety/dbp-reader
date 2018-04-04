import 'whatwg-fetch';
import { takeLatest, call, put, fork } from 'redux-saga/effects';
import request from 'utils/request';
import some from 'lodash/some';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
// import filter from 'lodash/filter';
import { ADD_HIGHLIGHTS, LOAD_HIGHLIGHTS, GET_HIGHLIGHTS } from './constants';
// import { fromJS } from 'immutable';
// import unionWith from 'lodash/unionWith';
// import { ADD_HIGHLIGHTS, LOAD_HIGHLIGHTS, GET_CHAPTER_TEXT, GET_HIGHLIGHTS, GET_BOOKS, GET_AUDIO, INIT_APPLICATION } from './constants';

/* Highlight possibilities
*
* Part of a verse
*
* Entire verse and part of other verses
*
* Overlaps another highlight
*
* */

export function* getHighlights({ bible, book, chapter, userId }) {
	const requestUrl = `https://api.bible.build/users/${userId || 'no_user_id'}/highlights?key=${process.env.DBP_API_KEY}&v=4&project_id=${process.env.NOTES_PROJECT_ID}&bible_id=${bible}&book_id=${book}&chapter=${chapter}`;
	let highlights = [];

	// const options = {
	// 	method: 'GET',
	// 	headers: {
	// 		project_id: process.env.NOTES_PROJECT_ID,
	// 	},
	// };
	// console.log('fetch options', options);
	try {
		const response = yield call(request, requestUrl);
		// console.log('highlight get response', response);
		if (response.data) {
			highlights = response.data;
		}

		yield put({ type: LOAD_HIGHLIGHTS, highlights });
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in highlights request', error); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('https://api.bible.build/error_logging', options);
		}
	}
}

export function* addHighlight({ bible, book, chapter, userId, verseStart, highlightStart, highlightedWords, color }) {
	const requestUrl = `https://api.bible.build/users/${userId}/highlights?key=${process.env.DBP_API_KEY}&v=4&bible_id=${bible}&book_id=${book}&chapter=${chapter}&project_id=${process.env.NOTES_PROJECT_ID}`;
	const formData = new FormData();
	// console.log('data for highlight { bible, book, chapter, userId, verseStart, highlightStart, highlightedWords, color }', { bible, book, chapter, userId, verseStart, highlightStart, highlightedWords, color });
	formData.append('book_id', book);
	formData.append('user_id', userId);
	formData.append('bible_id', bible);
	formData.append('chapter', chapter);
	formData.append('verse_start', verseStart);
	if (color !== 'none') {
		formData.append('highlighted_color', color);
	}
	formData.append('highlight_start', highlightStart + 1);
	formData.append('highlighted_words', highlightedWords);
	formData.append('project_id', process.env.NOTES_PROJECT_ID);

	const options = {
		method: 'POST',
		body: formData,
	};
	// console.log('add highlight data', { bible, book, chapter, userId, verseStart, highlightStart, highlightedWords });
	try {
		const response = yield call(request, requestUrl, options);
		// console.log('add highlight response', response);
		// Need to get the highlights here because they are not being returned
		if (response.success) {
			yield call(getHighlights, { bible, book, chapter, userId });
		} else if (response.error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Error creating highlight', response.error); // eslint-disable-line no-console
			}
		}
		// yield put({ type: LOAD_HIGHLIGHTS, highlights });
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in highlights request', error); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('https://api.bible.build/error_logging', options);
		}
	}
}

export function* getBibleFromUrl({ bibleId: oldBibleId, bookId: oldBookId, chapter, authenticated, userId }) {
	// This function needs to return the data listed below
	// Books
	// Active or first chapter text
	// Active or first chapter audio
	// Bible name
	// Bible id
	// todo Use other methods combined with the ones below to validate the url before try to use it in saga
	const bibleId = oldBibleId.toUpperCase();
	const bookId = oldBookId.toUpperCase();
	const requestUrl = `https://api.bible.build/bibles/${bibleId}?bucket=${process.env.DBP_BUCKET_ID}&key=${process.env.DBP_API_KEY}&v=4`;

	// Probably need to do stuff here to get the audio and text for this new bible
	try {
		const response = yield call(request, requestUrl);
		// let filesets;
		// // todo This can be removed once the filesets have been added to the default route
		// if (!response.data.filesets) {
		// 	const bibleUrl = `https://api.bible.build/bibles?bucket=${process.env.DBP_BUCKET_ID}&key=${process.env.DBP_API_KEY}&v=4&language_code=${response.data.iso}`;
		// 	const allBibles = yield call(request, bibleUrl);
		// 	// console.log('all bibles in language', allBibles);
		// 	const activeBible = allBibles.data.find((bible) => bible.abbr === bibleId) || {};
		// 	filesets = activeBible.filesets;
		// }
		// console.log('bible response', response);
		if (response.data && Object.keys(response.data).length) {
			// Creating new objects for each set of data needed to ensure I don't forget something
			// I probably will want to use 'yield all' for getting the audio and text so they can be run async
			const bible = response.data;
			const books = bible.books; // Need to ensure that I have the books here
			// console.log('books in new bible', books);
			const activeBook = books.find((b) => b.book_id === bookId);
			// console.log('active book', activeBook);
			const activeChapter = activeBook ? (parseInt(chapter, 10) || 1) : 1;
			const activeBookId = activeBook ? activeBook.book_id : get(books, [0, 'book_id'], '');
			const activeBookName = activeBook ? activeBook.name_short : get(books, [0, 'name_short'], '');
			const filesets = response.data.filesets.filter((f) => f.bucket_id === 'dbp-dev' && f.set_type_code !== 'app');
			// calling a generator that will handle the api requests for getting text
			// console.log('filtered filesets', filesets);
			const chapterData = yield call(getChapterFromUrl, {
				filesets,
				bibleId,
				bookId: activeBookId,
				chapter: activeChapter,
				authenticated,
				userId,
			});
			// console.log('chapter data', chapterData);
			// still need to include to active book name so that iteration happens here
			yield put({
				type: 'loadbible',
				filesets,
				name: bible.vname || bible.name,
				iso: bible.iso,
				languageName: bible.language,
				books,
				chapterData,
				bibleId,
				activeBookId,
				activeChapter,
				activeBookName,
			});
		}
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in get bible', error); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('https://api.bible.build/error_logging', options);
		}
		yield put({ type: 'loadbibleerror' });
	}
}
export function* getChapterFromUrl({ filesets, bibleId: oldBibleId, bookId: oldBookId, chapter, authenticated, userId }) {
	// console.log('bible, book, chapter', bibleId, bookId, chapter);
	// console.log('filesets chapter text', filesets);
	const bibleId = oldBibleId.toUpperCase();
	const bookId = oldBookId.toUpperCase();
	const hasFormattedText = some(filesets, (f) => f.set_type_code === 'text_format');
	// checking for audio but not fetching it as a part of this saga
	const hasAudio = some(filesets, (f) => f.set_type_code === 'audio' || f.set_type_code === 'audio_drama');

	try {
		let formattedText = '';
		let plainText = [];
		let hasPlainText = some(filesets, (f) => f.set_type_code === 'text_plain');

		if (authenticated) {
			yield fork(getHighlights, { bible: bibleId, book: bookId, chapter, userId });
		}
		// calling this function to start it asynchronously to this one.
		if (hasAudio) {
			// console.log('calling get chapter audio');
			// Not yielding this as it doesn't matter when the audio comes back
			// This function will sometimes have to make multiple api requests
			// And I don't want it blocking the text from loading
			yield fork(getChapterAudio, { filesets, bookId, chapter });
		}
		// console.log('has formatted text', hasFormattedText);
		// Try to get the formatted text if it is available
		if (hasFormattedText) {
			try {
				// Gets the last fileset id for a formatted text
				const filesetId = reduce(filesets, (a, c) => c.set_type_code === 'text_format' ? c.id : a, '');
				// console.log(filesetId);
				const reqUrl = `https://api.bible.build/bibles/filesets/${filesetId}?bucket=${process.env.DBP_BUCKET_ID}&key=${process.env.DBP_API_KEY}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=text_format`; // hard coded since this only ever needs to get formatted text
				// console.log(reqUrl);
				const formattedChapterObject = yield call(request, reqUrl);
				const path = get(formattedChapterObject.data, [0, 'path']);
				// console.log('response for formatted text', formattedChapterObject);
				formattedText = yield path ? fetch(path).then((res) => res.text()) : '';
				// console.log(formattedText);
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.error('Caught in get formatted text block', error); // eslint-disable-line no-console
				} else if (process.env.NODE_ENV === 'production') {
					// const options = {
					// 	header: 'POST',
					// 	body: formData,
					// };
					// fetch('https://api.bible.build/error_logging', options);
				}
			}
		}

		// Try to get the plain text every time
		// When this fails it should fail gracefully and not cause anything to break
		try {
			const reqUrl = `https://api.bible.build/bibles/${bibleId}/${bookId}/${chapter}?bucket=${process.env.DBP_BUCKET_ID}&key=${process.env.DBP_API_KEY}&v=4&book_id=${bookId}&chapter_id=${chapter}`;
			const res = yield call(request, reqUrl);
			// console.log('response for plain text', res);
			plainText = res.data;
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in get plain text block', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
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
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('https://api.bible.build/error_logging', options);
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

// I think it makes the most sense to start this running from within
// The getChapterFromUrl function. This may need to be adjusted when
// RTMP streaming is implemented
export function* getChapterAudio({ filesets, bookId, chapter }) {
	// console.log('getting audio', filesets, bookId, chapter);
	// Parse filesets
	// console.log('filesets', filesets);
	const filteredFilesets = reduce(filesets, (a, file) => {
		const newFile = { ...a };

		if (file.set_type_code === 'audio' || file.set_type_code === 'audio_drama') {
			newFile[file.id] = file;
		}

		return newFile;
	}, {});
	// console.log('filtered filesets', filteredFilesets);
	// console.log('filtered', filteredFilesets);
	// console.log('normal', filesets);
	const completeAudio = [];
	const ntAudio = [];
	const otAudio = [];
	const partialAudio = [];

	Object.entries(filteredFilesets).forEach((fileset) => {
		if (fileset[1].set_size_code === 'C') {
			completeAudio.push({ id: fileset[0], data: fileset[1] });
		} else if (fileset[1].set_size_code === 'NT') {
			ntAudio.push({ id: fileset[0], data: fileset[1] });
		} else if (fileset[1].set_size_code === 'OT') {
			otAudio.push({ id: fileset[0], data: fileset[1] });
		} else {
			partialAudio.push({ id: fileset[0], data: fileset[1] });
		}
	});
	// console.log('audio arrays', '\n', completeAudio, '\n', ntAudio, '\n', otAudio, '\n', partialAudio);
	const otLength = otAudio.length;
	const ntLength = ntAudio.length;

	if (completeAudio.length) {
		// console.log('Bible has complete audio', completeAudio);
		try {
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(completeAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(completeAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('complete audio response object', response);
			const audioPath = get(response, ['data', 0, 'path']);
			// console.log('complete audio path', audioPath);
			yield put({ type: 'loadaudio', audioPath });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio complete audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
			}
		}
	} else if (ntLength && !otLength) {
		try {
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(ntAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(ntAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('nt audio response object', response);
			const audioPath = get(response, ['data', 0, 'path']);
			// console.log('nt audio path', audioPath);
			yield put({ type: 'loadaudio', audioPath });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio nt audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
			}
		}
	} else if (otLength && !ntLength) {
		try {
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(otAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(otAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('ot audio response object', response);
			const audioPath = get(response, ['data', 0, 'path']);
			// console.log('ot audio path', audioPath);
			// otPath = audioPath;
			yield put({ type: 'loadaudio', audioPath });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio ot audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
			}
		}
	} else if (ntLength && otLength) {
		let ntPath = '';
		let otPath = '';
		// console.log('trying nt & ot', ntLength && !otLength, '\n', ntAudio, '\n', otAudio);

		try {
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(ntAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(ntAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('nt audio response object', response);
			const audioPath = get(response, ['data', 0, 'path']);
			// console.log('nt audio path', audioPath);
			ntPath = audioPath;
			// yield put({ type: 'loadaudio', audioPath });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio nt audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
			}
		}
		try {
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(otAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(otAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('ot audio response object', response);
			const audioPath = get(response, ['data', 0, 'path']);
			// console.log('ot audio path', audioPath);
			otPath = audioPath;
			// yield put({ type: 'loadaudio', audioPath });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio ot audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
			}
		}

		yield put({ type: 'loadaudio', audioPath: ntPath || otPath });
	} else if (partialAudio.length) {
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(partialAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(partialAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('partial audio response object', response);
			const audioPath = get(response, ['data', 0, 'path']);
			// console.log('partial audio path', audioPath);
			yield put({ type: 'loadaudio', audioPath });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
			}
		}
	}
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
	yield takeLatest('getaudio', getChapterAudio);
}
