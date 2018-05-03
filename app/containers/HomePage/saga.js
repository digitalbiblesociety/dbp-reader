import 'whatwg-fetch';
import { takeLatest, call, all, put, fork } from 'redux-saga/effects';
import request from 'utils/request';
import some from 'lodash/some';
import reduce from 'lodash/reduce';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import { getNotes } from 'containers/Notes/saga';
import { ADD_BOOKMARK } from 'containers/Notes/constants';
// import filter from 'lodash/filter';
import { ADD_HIGHLIGHTS, LOAD_HIGHLIGHTS, GET_HIGHLIGHTS, GET_NOTES_HOMEPAGE, GET_COPYRIGHTS } from './constants';
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

export function* addBookmark(props) {
	// console.log('adding bookmark with props: ', props);
	const requestUrl = `https://api.bible.build/users/${props.data.user_id}/notes?key=${process.env.DBP_API_KEY}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const formData = new FormData();

	Object.entries(props.data).forEach((item) => formData.set(item[0], item[1]));
	// formData.append('project_id', process.env.NOTES_PROJECT_ID);

	const options = {
		body: formData,
		method: 'POST',
	};
	// console.log('adding bookmark', addBookmark);
	try {
		const response = yield call(request, requestUrl, options);
		// console.log('user bookmark response', response);  // eslint-disable-line no-console
		if (response.success) {
			// do stuff
			// console.log('Success message: ', response.success);
		} else {
			// console.log('Other message that wasn\'t a success: ', response);
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('https://api.bible.build/error_logging', options);
		}
	}
}

export function* getBookMetadata({ bibleId }) {
	const reqUrl = `https://api.bible.build/bibles/${bibleId}/book?key=${process.env.DBP_API_KEY}&bucket=${process.env.DBP_BUCKET_ID}&v=4`;
	try {
		const response = yield call(request, reqUrl);
		const testaments = response.data.reduce((a, c) => ({ ...a, [c.id]: c.book_testament }), {});

		// console.log('res', res);
		yield put({ type: 'book_metadata', testaments });
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in get book metadata request', error); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('https://api.bible.build/error_logging', options);
		}
	}
}

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
	formData.append('highlight_start', highlightStart);
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
			// Not exactly sure why I am checking for an active book here
			let activeChapter = activeBook ? (parseInt(chapter, 10) || 1) : 1;
			// console.log('active book', activeBook);
			if (activeBook) {
				const lastChapterIndex = activeBook.chapters.length - 1;
				// console.log(!isNaN(parseInt(chapter, 10)));
				if (!isNaN(parseInt(chapter, 10))) {
					const parsedC = parseInt(chapter, 10);

					// console.log('38 is greater than 6', lastChapterIndex < parsedC, lastChapterIndex, parsedC);
					if (activeBook.chapters[lastChapterIndex] < parsedC) {
						activeChapter = activeBook.chapters[lastChapterIndex];
					} else if (activeBook.chapters[0] > parsedC) {
						activeChapter = activeBook.chapters[0];
					} else {
						activeChapter = parsedC;
					}
				} else {
					activeChapter = activeBook.chapters[0];
				}
			}
			// console.log('activeChapter', activeChapter);
			// console.log('activeBook.chapters[0]', activeBook.chapters[0]);
			// const activeChapter = activeBook ? (parseInt(chapter, 10) || 1) : 1;
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
	const hasFormattedText = some(filesets, (f) => (f.set_type_code === 'text_format' && f.bucket_id === 'dbp-dev'));
	// checking for audio but not fetching it as a part of this saga
	const hasAudio = some(filesets, (f) => (f.set_type_code === 'audio' && f.bucket_id === 'dbp-dev') || (f.set_type_code === 'audio_drama' && f.bucket_id === 'dbp-dev'));

	try {
		let formattedText = '';
		let formattedTextFilesetId = '';
		let plainTextFilesetId = '';
		let plainText = [];
		let hasPlainText = some(filesets, (f) => (f.set_type_code === 'text_plain' && f.bucket_id === 'dbp-dev'));

		if (authenticated) {
			yield fork(getHighlights, { bible: bibleId, book: bookId, chapter, userId });
			yield fork(getNotes, { userId, params: { bibleId, book_id: bookId, chapter } });
		}
		// calling this function to start it asynchronously to this one.
		// if (hasAudio) {
			// console.log('calling get chapter audio');
			// Not yielding this as it doesn't matter when the audio comes back
			// This function will sometimes have to make multiple api requests
			// And I don't want it blocking the text from loading
		yield fork(getChapterAudio, { filesets, bookId, chapter });
		// }
		yield fork(getBookMetadata, { bibleId });
		// console.log('has formatted text', hasFormattedText);
		// Try to get the formatted text if it is available
		if (hasFormattedText) {
			try {
				// Gets the last fileset id for a formatted text
				const filesetId = reduce(filesets, (a, c) => (c.set_type_code === 'text_format' && c.bucket_id === 'dbp-dev') ? c.id : a, '');
				// console.log('before fork');
				// yield fork(getCopyrightSaga, { filesetId });
				// console.log('after fork');
				const reqUrl = `https://api.bible.build/bibles/filesets/${filesetId}?bucket=${process.env.DBP_BUCKET_ID}&key=${process.env.DBP_API_KEY}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=text_format`; // hard coded since this only ever needs to get formatted text
				// console.log(reqUrl);
				const formattedChapterObject = yield call(request, reqUrl);
				const path = get(formattedChapterObject.data, [0, 'path']);
				// console.log('response for formatted text', formattedChapterObject);
				formattedText = yield path ? fetch(path).then((res) => res.text()) : '';

				formattedTextFilesetId = formattedText ? filesetId : '';
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
			const reqUrl = `https://api.bible.build/bibles/${bibleId}/${bookId}/${chapter}?key=${process.env.DBP_API_KEY}&v=4&book_id=${bookId}&chapter_id=${chapter}`;
			const res = yield call(request, reqUrl);
			// console.log('response for plain text', res);
			plainText = res.data;

			plainTextFilesetId = plainText ? bibleId : '';
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
			plainTextFilesetId,
			formattedText,
			formattedTextFilesetId,
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
	// Send a loadaudio action for each fail in production so that there isn't a link loaded
	// This handles the case where a user already has a link but getting the next one fails
	// console.log('getting audio', filesets, bookId, chapter);
	// Parse filesets |▰╭╮▰|
	// TODO: Need to handle when there are multiple filesets for the same audio type
	// console.log('filesets', filesets);
	const filteredFilesets = reduce(filesets, (a, file) => {
		const newFile = { ...a };

		if ((file.set_type_code === 'audio' || file.set_type_code === 'audio_drama') && file.id.slice(-4) !== 'DA16') {
			// console.log('is 16 bit', file.id.slice(-4) === 'DA16')
			newFile[file.id] = file;
		}

		return newFile;
	}, {});
	// If there isn't any audio then I want to just load an empty string and stop the function
	// console.log(filteredFilesets)
	if (!Object.keys(filteredFilesets).length) {
		yield put({ type: 'loadaudio', audioPaths: [''] });
		return;
	}
	// console.log('filtered filesets', filteredFilesets);
	// console.log('filtered', filteredFilesets);
	// console.log('normal', filesets);
	const completeAudio = [];
	const ntAudio = [];
	const otAudio = [];
	const partialOtAudio = [];
	const partialNtAudio = [];
	const partialNtOtAudio = [];

	Object.entries(filteredFilesets).forEach((fileset) => {
		if (fileset[1].set_size_code === 'C') {
			completeAudio.push({ id: fileset[0], data: fileset[1] });
		} else if (fileset[1].set_size_code === 'NT') {
			ntAudio.push({ id: fileset[0], data: fileset[1] });
		} else if (fileset[1].set_size_code === 'OT') {
			otAudio.push({ id: fileset[0], data: fileset[1] });
		} else if (fileset[1].set_size_code === 'OTP') {
			partialOtAudio.push({ id: fileset[0], data: fileset[1] });
		} else if (fileset[1].set_size_code === 'NTP') {
			partialNtAudio.push({ id: fileset[0], data: fileset[1] });
		} else if (fileset[1].set_size_code === 'NTPOTP') {
			partialNtOtAudio.push({ id: fileset[0], data: fileset[1] });
		}
	});
	// console.log('audio arrays', '\n', completeAudio, '\n', ntAudio, '\n', otAudio, '\n', partialAudio);
	const otLength = otAudio.length;
	const ntLength = ntAudio.length;

	let otHasUrl = false;
	let ntHasUrl = false;

	if (completeAudio.length) {
		// console.log('Bible has complete audio', completeAudio);
		try {
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(completeAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(completeAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('complete audio response object', response);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			// console.log('complete audio path', audioPaths);
			yield put({ type: 'loadaudio', audioPaths });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio complete audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
		return;
	} else if (ntLength && !otLength) {
		try {
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(ntAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(ntAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('nt audio response object', response);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			// console.log('nt audio path', audioPaths);
			ntHasUrl = !!audioPaths[0];
			yield put({ type: 'loadaudio', audioPaths });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio nt audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
	} else if (otLength && !ntLength) {
		try {
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(otAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(otAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('ot audio response object', response);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			// console.log('ot audio path', audioPaths);
			// otPath = audioPaths;
			otHasUrl = !!audioPaths[0];
			yield put({ type: 'loadaudio', audioPaths });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio ot audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
				yield put({ type: 'loadaudio', audioPaths: [''] });
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
			const audioPaths = [get(response, ['data', 0, 'path'])];
			// console.log('nt audio path', audioPaths);
			ntPath = audioPaths;
			// yield put({ type: 'loadaudio', audioPaths });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio nt audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
		try {
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(otAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(otAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('ot audio response object', response);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			// console.log('ot audio path', audioPaths);
			otPath = audioPaths;
			// yield put({ type: 'loadaudio', audioPaths });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio ot audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
		ntHasUrl = !!ntPath;
		otHasUrl = !!otPath;
		yield put({ type: 'loadaudio', audioPaths: ntPath || otPath });
	}

	if (partialOtAudio.length && !otLength && (!otHasUrl && !ntHasUrl)) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		// console.log('files that contain partial audio', partialAudio);
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(partialOtAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(partialOtAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('partial audio response object', response);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			// console.log('partial audio path', audioPaths);
			yield put({ type: 'loadaudio', audioPaths });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
	}

	if (partialNtAudio.length && !ntLength && (!otHasUrl && !ntHasUrl)) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		// console.log('files that contain partial audio', partialAudio);
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(partialNtAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(partialNtAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('partial audio response object', response);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			// console.log('partial audio path', audioPaths);
			yield put({ type: 'loadaudio', audioPaths });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
	}

	if (partialNtOtAudio.length && (!otLength && !ntLength) && (!otHasUrl && !ntHasUrl)) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		// console.log('files that contain partial audio', partialAudio);
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `https://api.bible.build/bibles/filesets/${get(partialNtOtAudio, [0, 'id'])}?bucket=${process.env.DBP_BUCKET_ID}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(partialNtOtAudio, [0, 'data', 'set_type_code'])}`;
			const response = yield call(request, reqUrl);
			// console.log('partial audio response object', response);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			// console.log('partial audio path', audioPaths);
			yield put({ type: 'loadaudio', audioPaths });
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error); // eslint-disable-line no-console
			} else if (process.env.NODE_ENV === 'production') {
				// const options = {
				// 	header: 'POST',
				// 	body: formData,
				// };
				// fetch('https://api.bible.build/error_logging', options);
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
	}
}

export function* getCopyrightSaga({ filesetIds }) {
	// console.log('In the fork');
	const reqUrls = [];
	// console.log('ids', filesetIds);
	uniq(filesetIds.filter((f) => !!f)).forEach((id) => reqUrls.push(`https://api.bible.build/bibles/filesets/${id}/copyright?key=${process.env.DBP_API_KEY}&v=4`));

	try {
		const response = yield all(reqUrls.map((url) => call(request, url)));
		const copyrightArray = response.map((res) => res.copyright);
		// console.log('copyright response', response);
		const copyrights = copyrightArray.map((cp) => ({ message: cp.copyright, organizations: cp.organizations.map((org) => ({ name: org.slug, logo: org.logos[0], url: org.url_website })) }));
		// console.log('copyrights', copyrights);
		yield put({ type: 'loadcopyright', copyrights });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('Caught in get copyright', err); // eslint-disable-line no-console
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
	yield takeLatest(ADD_BOOKMARK, addBookmark);
	yield takeLatest(GET_NOTES_HOMEPAGE, getNotes);
	yield takeLatest(GET_COPYRIGHTS, getCopyrightSaga);
}
