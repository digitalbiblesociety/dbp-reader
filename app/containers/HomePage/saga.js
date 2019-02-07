import fetch from 'isomorphic-fetch';
import { takeLatest, call, all, put, fork } from 'redux-saga/effects';
import some from 'lodash/some';
import get from 'lodash/get';
import uniqWith from 'lodash/uniqWith';
import Router from 'next/router';
import request from '../../utils/request';
import {
	getNotesForChapter,
	getBookmarksForChapter,
	getUserHighlights,
} from '../Notes/saga';
import { getCountries, getLanguages, getTexts } from '../TextSelection/saga';
import { ADD_BOOKMARK } from '../Notes/constants';
import {
	ADD_HIGHLIGHTS,
	LOAD_HIGHLIGHTS,
	GET_HIGHLIGHTS,
	GET_NOTES_HOMEPAGE,
	GET_COPYRIGHTS,
	INIT_APPLICATION,
	DELETE_HIGHLIGHTS,
	ADD_BOOKMARK_SUCCESS,
	ADD_BOOKMARK_FAILURE,
	CREATE_USER_WITH_SOCIAL_ACCOUNT,
} from './constants';
import { ntCodes, otCodes, codes } from './sagaUtils';

export function* deleteHighlights({
	ids,
	userId,
	bible,
	book,
	chapter,
	limit,
	page,
}) {
	const urls = ids.map(
		(id) =>
			`${process.env.BASE_API_ROUTE}/users/${userId}/highlights/${id}?key=${
				process.env.DBP_API_KEY
			}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`,
	);
	const options = {
		method: 'DELETE',
	};
	try {
		yield all(urls.map((url) => call(request, url, options)));
		yield fork(getHighlights, { bible, book, chapter, userId });
		yield fork(getUserHighlights, { userId, params: { limit, page } });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('There was an error deleting the highlights', err); // eslint-disable-line no-console
		}
	}
}

export function* getCountriesAndLanguages() {
	yield fork(getCountries);
	yield fork(getLanguages);
}

export function* initApplication(props) {
	const languageISO = props.languageISO;
	const languageCode = props.languageCode;
	// Set a timeout for 24 hours so that if the user does not refresh the page
	// within that time the languages and countries will be re-fetched
	const timeoutDuration = 1000 * 60 * 60 * 24;
	setTimeout(function runTimeout() {
		getCountriesAndLanguages();
		setTimeout(runTimeout, timeoutDuration);
	}, timeoutDuration);
	// Forking each of these sagas here on the init of the application so that they all run in parallel
	yield fork(getCountries);
	yield fork(getLanguages);
	yield fork(getTexts, { languageISO, languageCode });
}

export function* addBookmark(props) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/users/${
		props.data.user_id
	}/bookmarks?key=${process.env.DBP_API_KEY}&v=4&pretty&project_id=${
		process.env.NOTES_PROJECT_ID
	}`;
	const formData = new FormData();

	Object.entries(props.data).forEach((item) => formData.set(item[0], item[1]));
	formData.append('tags', `reference::: ${props.data.reference}`);

	const options = {
		body: formData,
		method: 'POST',
	};
	try {
		const response = yield call(request, requestUrl, options);
		if (response) {
			yield fork(getBookmarksForChapter, {
				userId: props.data.user_id,
				params: {
					bible_id: props.data.bible_id,
					book_id: props.data.book_id,
					chapter: props.data.chapter,
					limit: 150,
					page: 1,
				},
			});
			yield put({
				type: ADD_BOOKMARK_SUCCESS,
				userId: props.data.user_id,
				params: {
					bible_id: props.data.bible_id,
					book_id: props.data.book_id,
					chapter: props.data.chapter,
					limit: 150,
					page: 1,
				},
			});
		} else {
			yield put({ type: ADD_BOOKMARK_FAILURE });
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('There was an error saving the bookmark', err); // eslint-disable-line no-console
		}
		yield put({ type: ADD_BOOKMARK_FAILURE });
	}
}

export function* getBookMetadata({ bibleId }) {
	const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/${bibleId}/book?key=${
		process.env.DBP_API_KEY
	}&asset_id=${process.env.DBP_BUCKET_ID}&v=4`;
	try {
		const response = yield call(request, reqUrl);
		const testaments = response.data.reduce(
			(a, c) => ({ ...a, [c.id]: c.book_testament }),
			{},
		);

		yield put({ type: 'book_metadata', testaments });
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in get book metadata request', error); // eslint-disable-line no-console
		}
	}
}

export function* getHighlights({ bible, book, chapter, userId }) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/users/${userId ||
		'no_user_id'}/highlights?key=${process.env.DBP_API_KEY}&v=4&project_id=${
		process.env.NOTES_PROJECT_ID
	}&bible_id=${bible}&book_id=${book}&chapter=${chapter}&limit=1000`;
	let highlights = [];

	try {
		const response = yield call(request, requestUrl);
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

export function* addHighlight({
	bible,
	book,
	chapter,
	userId,
	verseStart,
	highlightStart,
	highlightedWords,
	color,
	reference,
}) {
	const requestUrl = `${
		process.env.BASE_API_ROUTE
	}/users/${userId}/highlights?key=${
		process.env.DBP_API_KEY
	}&v=4&bible_id=${bible}&book_id=${book}&chapter=${chapter}&project_id=${
		process.env.NOTES_PROJECT_ID
	}&limit=1000`;
	const formData = new FormData();
	if (!userId || color === 'none') {
		return;
	}
	formData.append('book_id', book);
	formData.append('user_id', userId);
	formData.append('bible_id', bible);
	formData.append('fileset_id', bible);
	formData.append('chapter', chapter);
	formData.append('verse_start', verseStart);
	if (color !== 'none') {
		formData.append('highlighted_color', color);
	}
	formData.append('highlight_start', highlightStart);
	formData.append('highlighted_words', highlightedWords);
	formData.append('project_id', process.env.NOTES_PROJECT_ID);
	formData.append('reference', reference);

	const options = {
		method: 'POST',
		body: formData,
	};
	try {
		const response = yield call(request, requestUrl, options);
		// Need to get the highlights here because they are not being returned
		if (response.meta.success) {
			yield call(getHighlights, { bible, book, chapter, userId });
		} else if (response.error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Error creating highlight', response.error); // eslint-disable-line no-console
			}
		}
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Caught in highlights request', error); // eslint-disable-line no-console
		}
	}
}

export function* getBibleFromUrl({
	bibleId: oldBibleId,
	bookId: oldBookId,
	chapter,
	authenticated,
	userId,
	verse,
}) {
	// This function needs to return the data listed below
	// Books
	// Active or first chapter text
	// Active or first chapter audio
	// Bible name
	// Bible id
	const bibleId = oldBibleId.toUpperCase();
	const bookId = oldBookId.toUpperCase();
	const requestUrl = `${
		process.env.BASE_API_ROUTE
	}/bibles/${bibleId}?asset_id=${process.env.DBP_BUCKET_ID}&key=${
		process.env.DBP_API_KEY
	}&v=4`;

	// Probably need to do stuff here to get the audio and text for this new bible
	try {
		const response = yield call(request, requestUrl);

		if (response.data && Object.keys(response.data).length) {
			// Creating new objects for each set of data needed to ensure I don't forget something
			// I probably will want to use 'yield all' for getting the audio and text so they can be run async
			const bible = response.data;
			const books = bible.books; // Need to ensure that I have the books here
			const textDirection =
				response.data.alphabet && response.data.alphabet.direction;
			let hasMatt = false;
			let activeBook = books.find((b) => {
				if (b.book_id === 'MAT') {
					hasMatt = true;
				}
				return b.book_id === bookId;
			});
			// Not exactly sure why I am checking for an active book here
			let activeChapter = activeBook ? parseInt(chapter, 10) || 1 : 1;
			if (activeBook) {
				const lastChapterIndex = activeBook.chapters.length - 1;
				if (!isNaN(parseInt(chapter, 10))) {
					const parsedC = parseInt(chapter, 10);

					// Checks if the entered number is greater than the last chapter
					if (activeBook.chapters[lastChapterIndex] < parsedC) {
						activeChapter = activeBook.chapters[lastChapterIndex];
						// Checks if the entered number is less than the starting number
					} else if (activeBook.chapters[0] > parsedC) {
						activeChapter = activeBook.chapters[0];
					} else {
						activeChapter = parsedC;
					}
				} else {
					// If a non number was entered then it will start at the first chapter in the book
					activeChapter = activeBook.chapters[0];
				}
			}
			// Nesting a ternary here because it keeps me from needing more variables and an if statement
			// If there wasn't an activeBook for the bookId given then check for if the resource has Matthew
			// If it has Matthew then use the bookId for that, otherwise just use the first bookId available
			const activeBookId = activeBook // eslint-disable-line no-nested-ternary
				? activeBook.book_id
				: hasMatt
					? 'MAT'
					: get(books, [0, 'book_id'], '');
			const activeBookName = activeBook
				? activeBook.name_short
				: get(books, [0, 'name_short'], '');
			if (!activeBook) {
				activeBook = books.find((b) => b.book_id === activeBookId);
			}
			let filesets = [];
			if (
				response.data &&
				response.data.filesets[process.env.DBP_BUCKET_ID] &&
				response.data.filesets['dbp-vid']
			) {
				filesets = [
					...response.data.filesets['dbp-vid'],
					...response.data.filesets[process.env.DBP_BUCKET_ID],
				].filter(
					(f) =>
						(f.type === 'audio' ||
							f.type === 'audio_drama' ||
							f.type === 'text_plain' ||
							f.type === 'text_format' ||
							f.type === 'video_stream') &&
						f.id.slice(-4) !== 'DA16',
				);
			} else if (
				response.data &&
				response.data.filesets[process.env.DBP_BUCKET_ID]
			) {
				filesets = response.data.filesets[process.env.DBP_BUCKET_ID].filter(
					(f) =>
						(f.type === 'audio' ||
							f.type === 'audio_drama' ||
							f.type === 'text_plain' ||
							f.type === 'text_format' ||
							f.type === 'video_stream') &&
						f.id.slice(-4) !== 'DA16',
				);
			}
			yield fork(getCopyrightSaga, { filesetIds: filesets });

			const chapterData = yield call(getChapterFromUrl, {
				filesets,
				bibleId,
				bookId: activeBookId,
				chapter: activeChapter,
				authenticated,
				userId,
				verse,
			});
			// still need to include to active book name so that iteration happens here
			yield put({
				type: 'loadbible',
				filesets,
				name: bible.vname ? bible.vname : bible.name || bible.abbr,
				iso: bible.iso,
				languageCode: bible.language_id,
				textDirection,
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
		}
		yield put({ type: 'loadbibleerror' });
	}
}

export function* getChapterFromUrl({
	filesets,
	bibleId: oldBibleId,
	bookId: oldBookId,
	chapter,
	authenticated,
	userId,
	verse,
}) {
	const bibleId = oldBibleId.toUpperCase();
	const bookId = oldBookId.toUpperCase();
	const hasFormattedText = some(filesets, (f) => f.type === 'text_format');
	// checking for audio but not fetching it as a part of this saga
	const hasAudio = some(
		filesets,
		(f) => f.type === 'audio' || f.type === 'audio_drama',
	);

	try {
		let formattedText = '';
		let formattedTextFilesetId = '';
		let plainTextFilesetId = '';
		let plainText = [];
		let hasPlainText = some(filesets, (f) => f.type === 'text_plain');

		if (authenticated) {
			yield fork(getHighlights, {
				bible: bibleId,
				book: bookId,
				chapter,
				userId,
			});
			yield fork(getNotesForChapter, {
				userId,
				params: {
					bible_id: bibleId,
					book_id: bookId,
					chapter,
					limit: 150,
					page: 1,
				},
			});
			yield fork(getBookmarksForChapter, {
				userId,
				params: {
					bible_id: bibleId,
					book_id: bookId,
					chapter,
					limit: 150,
					page: 1,
				},
			});
		}

		yield fork(getChapterAudio, { filesets, bookId, chapter });
		yield fork(getBookMetadata, { bibleId });
		// Try to get the formatted text if it is available
		if (hasFormattedText) {
			try {
				// Gets the last fileset id for a formatted text
				const filesetId =
					filesets.reduce(
						(a, c) => (c.type === 'text_format' ? c.id : a),
						'',
					) || bibleId;
				if (filesetId) {
					const reqUrl = `${
						process.env.BASE_API_ROUTE
					}/bibles/filesets/${filesetId}?asset_id=${
						process.env.DBP_BUCKET_ID
					}&key=${
						process.env.DBP_API_KEY
					}&v=4&book_id=${bookId}&chapter_id=${chapter}&type=text_format`; // hard coded since this only ever needs to get formatted text
					const formattedChapterObject = yield call(request, reqUrl);
					const path = get(formattedChapterObject.data, [0, 'path']);
					formattedText = yield path
						? fetch(path).then((res) => res.text())
						: '';

					formattedTextFilesetId = filesetId;
				}
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.error('Caught in get formatted text block', error); // eslint-disable-line no-console
				}
			}
		}

		// Try to get the plain text every time
		// When this fails it should fail gracefully and not cause anything to break
		try {
			let filesetId = '';
			if (filesets.filter((set) => set.type === 'text_plain').length > 1) {
				filesetId = filesets.reduce(
					(a, c) => (c.type === 'text_plain' ? a.concat(c.id) : a),
					[],
				);
			} else {
				filesetId = filesets.reduce(
					(a, c) => (c.type === 'text_plain' ? c.id : a),
					'',
				);
			}

			if (Array.isArray(filesetId) && filesetId.length > 1) {
				// Discuss the issues with having multiple filesets for text
				// Will probably need to build out a list of checks like for the audio
				const results = yield call(tryNext, {
					urls: filesetId,
					index: 0,
					bookId,
					chapter,
				});

				plainText = results.plainText;
				plainTextFilesetId = results.plainTextFilesetId;
			} else if (filesetId) {
				const reqUrl = `${
					process.env.BASE_API_ROUTE
				}/bibles/filesets/${filesetId}/${bookId}/${chapter}?key=${
					process.env.DBP_API_KEY
				}&v=4&book_id=${bookId}&chapter_id=${chapter}`;
				const res = yield call(request, reqUrl);
				plainText = res.data;

				plainTextFilesetId = plainText ? bibleId : '';
			}
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in get plain text block', error); // eslint-disable-line no-console
			}
			hasPlainText = false;
		}

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
			bookId,
			chapter,
			verse,
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

// Utility function for getting the plain text
function* tryNext({ urls, index, bookId, chapter }) {
	let plainText = [];
	let plainTextFilesetId = '';
	try {
		const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${
			urls[index]
		}/${bookId}/${chapter}?key=${
			process.env.DBP_API_KEY
		}&v=4&book_id=${bookId}&chapter_id=${chapter}`;

		const res = yield call(request, reqUrl);

		plainText = res.data;
		plainTextFilesetId = urls[index];

		return {
			plainText,
			plainTextFilesetId,
		};
	} catch (err) {
		if (err) {
			console.warn('Error in try next function', err); // eslint-disable-line no-console
		}

		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${
				urls[index + 1]
			}/${bookId}/${chapter}?key=${
				process.env.DBP_API_KEY
			}&v=4&book_id=${bookId}&chapter_id=${chapter}`;

			const res = yield call(request, reqUrl);
			plainText = res.data;

			plainTextFilesetId = urls[index];

			return {
				plainText,
				plainTextFilesetId,
			};
		} catch (error) {
			if (error) {
				console.warn('Error in try next function', error); // eslint-disable-line no-console
			}
			return {
				plainText,
				plainTextFilesetId,
			};
		}
	}
}

// I think it makes the most sense to start this running from within
// The getChapterFromUrl function. This may need to be adjusted when
// HLS streaming is implemented
export function* getChapterAudio({ filesets, bookId, chapter }) {
	// Send a loadaudio action for each fail in production so that there isn't a link loaded
	// This handles the case where a user already has a link but getting the next one fails
	// Parse filesets |▰╭╮▰|
	// TODO: Need to handle when there are multiple filesets for the same audio type
	const filteredFilesets = filesets.reduce((a, file) => {
		const newFile = { ...a };

		if (
			(file.type === 'audio' || file.type === 'audio_drama') &&
			file.id.slice(-4) !== 'DA16'
		) {
			newFile[file.id] = file;
		}

		return newFile;
	}, {});
	// If there isn't any audio then I want to just load an empty string and stop the function
	if (!Object.keys(filteredFilesets).length) {
		yield put({ type: 'loadaudio', audioPaths: [''] });
		return;
	}
	const completeAudio = [];
	const ntAudio = [];
	const otAudio = [];
	const partialOtAudio = [];
	const partialNtAudio = [];
	const partialNtOtAudio = [];

	Object.entries(filteredFilesets)
		.sort((a, b) => {
			if (a[1].type === 'audio_drama') return 1;
			if (b[1].type === 'audio_drama') return 1;
			if (a[1].type > b[1].type) return 1;
			if (a[1].type < b[1].type) return -1;
			return 0;
		})
		.forEach((fileset) => {
			if (fileset[1].size === 'C') {
				completeAudio.push({ id: fileset[0], data: fileset[1] });
			} else if (fileset[1].size === 'NT') {
				ntAudio.push({ id: fileset[0], data: fileset[1] });
			} else if (fileset[1].size === 'OT') {
				otAudio.push({ id: fileset[0], data: fileset[1] });
			} else if (fileset[1].size === 'OTP') {
				partialOtAudio.push({ id: fileset[0], data: fileset[1] });
			} else if (fileset[1].size === 'NTP') {
				partialNtAudio.push({ id: fileset[0], data: fileset[1] });
			} else if (fileset[1].size === 'NTPOTP') {
				partialNtOtAudio.push({ id: fileset[0], data: fileset[1] });
			}
		});
	const otLength = otAudio.length;
	const ntLength = ntAudio.length;

	let otHasUrl = false;
	let ntHasUrl = false;

	if (completeAudio.length) {
		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				completeAudio,
				[0, 'id'],
			)}?asset_id=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				completeAudio,
				[0, 'data', 'type'],
			)}`;
			const response = yield call(request, reqUrl);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			yield put({
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(completeAudio, [0, 'id']),
			});
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio complete audio', error); // eslint-disable-line no-console
				yield put({ type: 'loadaudio', audioPaths: [''] });
			} else if (
				process.env.NODE_ENV === 'production' ||
				process.env.NODE_ENV === 'staging'
			) {
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
		return;
	} else if (ntLength && !otLength) {
		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				ntAudio,
				[0, 'id'],
			)}?asset_id=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				ntAudio,
				[0, 'data', 'type'],
			)}`;
			const response = yield call(request, reqUrl);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			ntHasUrl = !!audioPaths[0];
			yield put({
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(ntAudio, [0, 'id']),
			});
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio nt audio', error); // eslint-disable-line no-console
				yield put({ type: 'loadaudio', audioPaths: [''] });
			} else if (
				process.env.NODE_ENV === 'production' ||
				process.env.NODE_ENV === 'staging'
			) {
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
	} else if (otLength && !ntLength) {
		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				otAudio,
				[0, 'id'],
			)}?asset_id=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				otAudio,
				[0, 'data', 'type'],
			)}`;
			const response = yield call(request, reqUrl);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			otHasUrl = !!audioPaths[0];
			yield put({
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(otAudio, [0, 'id']),
			});
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio ot audio', error); // eslint-disable-line no-console
				yield put({ type: 'loadaudio', audioPaths: [''] });
			} else if (
				process.env.NODE_ENV === 'production' ||
				process.env.NODE_ENV === 'staging'
			) {
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
	} else if (ntLength && otLength) {
		let ntPath = '';
		let otPath = '';

		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				ntAudio,
				[0, 'id'],
			)}?asset_id=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				ntAudio,
				[0, 'data', 'type'],
			)}`;
			const response = yield call(request, reqUrl);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			ntPath = audioPaths;
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio nt audio', error); // eslint-disable-line no-console
				yield put({ type: 'loadaudio', audioPaths: [''] });
			} else if (
				process.env.NODE_ENV === 'production' ||
				process.env.NODE_ENV === 'staging'
			) {
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
		try {
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				otAudio,
				[0, 'id'],
			)}?asset_id=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				otAudio,
				[0, 'data', 'type'],
			)}`;
			const response = yield call(request, reqUrl);
			const audioPaths = [get(response, ['data', 0, 'path'])];
			otPath = audioPaths;
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio ot audio', error); // eslint-disable-line no-console
				yield put({ type: 'loadaudio', audioPaths: [''] });
			} else if (
				process.env.NODE_ENV === 'production' ||
				process.env.NODE_ENV === 'staging'
			) {
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
		ntHasUrl = !!ntPath;
		otHasUrl = !!otPath;
		yield put({
			type: 'loadaudio',
			audioPaths: ntPath || otPath,
			audioFilesetId: ntPath
				? get(ntAudio, [0, 'id'])
				: get(otAudio, [0, 'id']),
		});
	}

	if (partialOtAudio.length && !otLength && (!otHasUrl && !ntHasUrl)) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				partialOtAudio,
				[0, 'id'],
			)}?asset_id=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				partialOtAudio,
				[0, 'data', 'type'],
			)}`;
			const response = yield call(request, reqUrl);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			yield put({
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(partialOtAudio, [0, 'id']),
			});
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error); // eslint-disable-line no-console
				yield put({ type: 'loadaudio', audioPaths: [''] });
			} else if (
				process.env.NODE_ENV === 'production' ||
				process.env.NODE_ENV === 'staging'
			) {
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
	}

	if (partialNtAudio.length && !ntLength && (!otHasUrl && !ntHasUrl)) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				partialNtAudio,
				[0, 'id'],
			)}?asset_id=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				partialNtAudio,
				[0, 'data', 'type'],
			)}`;
			const response = yield call(request, reqUrl);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			yield put({
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(partialNtAudio, [0, 'id']),
			});
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error); // eslint-disable-line no-console
				yield put({ type: 'loadaudio', audioPaths: [''] });
			} else if (
				process.env.NODE_ENV === 'production' ||
				process.env.NODE_ENV === 'staging'
			) {
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
	}

	if (
		partialNtOtAudio.length &&
		(!otLength && !ntLength) &&
		(!otHasUrl && !ntHasUrl)
	) {
		// return a list of all of the s3 file paths since a chapter could have v1-v5 and v20-v25
		try {
			// Need to iterate over each object here to see if I can find the right chapter
			const reqUrl = `${process.env.BASE_API_ROUTE}/bibles/filesets/${get(
				partialNtOtAudio,
				[0, 'id'],
			)}?asset_id=${
				process.env.DBP_BUCKET_ID
			}&key=e8a946a0-d9e2-11e7-bfa7-b1fb2d7f5824&v=4&book_id=${bookId}&chapter_id=${chapter}&type=${get(
				partialNtOtAudio,
				[0, 'data', 'type'],
			)}`;
			const response = yield call(request, reqUrl);
			const audioPaths = [];
			if (response.data.length > 1) {
				response.data.forEach((file) => audioPaths.push(file.path));
			} else {
				audioPaths.push(get(response, ['data', 0, 'path']));
			}
			yield put({
				type: 'loadaudio',
				audioPaths,
				audioFilesetId: get(partialNtOtAudio, [0, 'id']),
			});
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Caught in getChapterAudio partial audio', error); // eslint-disable-line no-console
				yield put({ type: 'loadaudio', audioPaths: [''] });
			} else if (
				process.env.NODE_ENV === 'production' ||
				process.env.NODE_ENV === 'staging'
			) {
				yield put({ type: 'loadaudio', audioPaths: [''] });
			}
		}
	}
}

export function* getCopyrightSaga({ filesetIds }) {
	// TODO: Try to optimize at least a little bit
	const filteredFilesetIds = uniqWith(
		filesetIds.filter((f) => codes[f.type] && codes[f.size]),
		(a, b) => a.type === b.type && a.size === b.size,
	);
	const videoFileset = filesetIds.filter(
		(f) => f.type === 'video_stream' && codes[f.size],
	)[0];
	const reqUrls = [];

	// TODO: Need a type param to add on to the end of this call so that I will get the copyright type that I need
	filteredFilesetIds.forEach((set) =>
		reqUrls.push(
			`${process.env.BASE_API_ROUTE}/bibles/filesets/${set.id}/copyright?key=${
				process.env.DBP_API_KEY
			}&v=4&asset_id=${process.env.DBP_BUCKET_ID}&type=${set.type}`,
		),
	);

	try {
		const response = yield all(reqUrls.map((url) => call(request, url)));
		const vidRes = [];
		if (videoFileset) {
			const r = yield call(
				request,
				`${process.env.BASE_API_ROUTE}/bibles/filesets/${
					videoFileset.id
				}/copyright?key=${process.env.DBP_API_KEY}&v=4&asset_id=dbp-vid&type=${
					videoFileset.type
				}`,
			);
			vidRes.push(r);
		}
		// Takes the response and turns it into an array that is more easily used and that doesn't contain unnecessary fields
		const copyrights =
			response.map(
				(cp) =>
					Object.keys(cp).length
						? {
								message: cp.copyright.copyright,
								testament: cp.size || cp.set_size_code,
								type: cp.type || cp.set_type_code,
								organizations: cp.copyright.organizations.map((org) => {
									// Getting landscape instead of icons
									const icon = org.logos.find((l) => !l.icon);
									if (org.translations.length) {
										return {
											name: org.translations[0].name,
											logo: icon || (org.logos && org.logos[0]),
											isIcon: icon === undefined ? 1 : 0,
											url: org.url_website,
										};
									}
									return {
										name: '',
										logo: '',
										isIcon: 0,
										url: '',
									};
								}),
						  }
						: {},
			) || [];
		const videoCopyright =
			vidRes.map(
				(cp) =>
					Object.keys(cp).length
						? {
								message: cp.copyright.copyright,
								testament: cp.size || cp.set_size_code,
								type: cp.type || cp.set_type_code,
								organizations: cp.copyright.organizations.map((org) => {
									// Getting landscape instead of icons
									const icon = org.logos.find((l) => !l.icon);
									if (org.translations.length) {
										return {
											name: org.translations[0].name,
											logo: icon || (org.logos && org.logos[0]),
											isIcon: icon === undefined ? 1 : 0,
											url: org.url_website,
										};
									}
									return {
										name: '',
										logo: '',
										isIcon: 0,
										url: '',
									};
								}),
						  }
						: {},
			) || [];

		const cText = copyrights.filter(
			(c) =>
				c.testament === 'C' &&
				(c.type === 'text_plain' || c.type === 'text_format'),
		)[0];
		const ntText = !cText
			? copyrights.filter(
					(c) =>
						ntCodes[c.testament] &&
						(c.type === 'text_plain' || c.type === 'text_format'),
			  )[0]
			: {};
		const otText = !cText
			? copyrights.filter(
					(c) =>
						otCodes[c.testament] &&
						(c.type === 'text_plain' || c.type === 'text_format'),
			  )[0]
			: {};
		const partialText = copyrights.filter(
			(c) =>
				c.testament === 'P' &&
				(c.type === 'text_plain' || c.type === 'text_format'),
		)[0];

		const cAudio = copyrights.filter(
			(c) =>
				c.testament === 'C' && (c.type === 'audio' || c.type === 'audio_drama'),
		)[0];
		const ntAudio = !cAudio
			? copyrights.filter(
					(c) =>
						ntCodes[c.testament] &&
						(c.type === 'audio' || c.type === 'audio_drama'),
			  )[0]
			: {};
		const otAudio = !cAudio
			? copyrights.filter(
					(c) =>
						otCodes[c.testament] &&
						(c.type === 'audio' || c.type === 'audio_drama'),
			  )[0]
			: {};
		const partialAudio = copyrights.filter(
			(c) =>
				c.testament === 'P' && (c.type === 'audio' || c.type === 'audio_drama'),
		)[0];

		const cVideo = videoCopyright.filter(
			(c) => c.testament === 'C' && c.type === 'video_stream',
		)[0];
		const ntVideo = !cVideo
			? videoCopyright.filter(
					(c) => ntCodes[c.testament] && c.type === 'video_stream',
			  )[0]
			: {};
		const otVideo = !cVideo
			? videoCopyright.filter(
					(c) => otCodes[c.testament] && c.type === 'video_stream',
			  )[0]
			: {};
		const partialVideo = videoCopyright.filter(
			(c) => c.testament === 'P' && c.type === 'video_stream',
		)[0];
		const copyrightObject = {
			newTestament: {
				audio: cAudio || ntAudio || partialAudio,
				text: cText || ntText || partialText,
				video: cVideo || ntVideo || partialVideo,
			},
			oldTestament: {
				audio:
					!(cAudio || ntAudio || partialAudio) &&
					(cAudio || otAudio || partialAudio),
				text:
					!(cAudio || ntAudio || partialText) &&
					(cText || otText || partialText),
				video:
					!(cVideo || ntVideo || partialVideo) &&
					(cVideo || otVideo || partialVideo),
			},
		};

		yield put({ type: 'loadcopyright', copyrights: copyrightObject });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('Caught in get copyright', err); // eslint-disable-line no-console
		}
	}
}

export function* createSocialUser({ provider }) {
	const reqUrl = `${
		process.env.BASE_API_ROUTE
	}/login/${provider}?v=4&project_id=${process.env.NOTES_PROJECT_ID}&key=${
		process.env.DBP_API_KEY
	}${process.env.IS_DEV ? '&alt_url=true' : ''}`;

	try {
		const response = yield call(request, reqUrl);
		if (response.data.redirect_url) {
			// only let provider cookie be set for 15 minutes
			const mins = 1000 * 60 * 15;
			document.cookie = `bible_is_provider=${
				response.data.provider_id
			}; expires=${new Date(
				new Date().getTime() + mins,
			).toUTCString()}; path=/`;
			Router.replace(response.data.redirect_url);
		}
	} catch (err) {
		console.log('create social error', err); // eslint-disable-line no-console
	}
}

// Individual exports for testing
export default function* defaultSaga() {
	yield takeLatest(INIT_APPLICATION, initApplication);
	yield takeLatest('getchapter', getChapterFromUrl);
	yield takeLatest(GET_HIGHLIGHTS, getHighlights);
	yield takeLatest(ADD_HIGHLIGHTS, addHighlight);
	yield takeLatest('getbible', getBibleFromUrl);
	yield takeLatest('getaudio', getChapterAudio);
	yield takeLatest(ADD_BOOKMARK, addBookmark);
	yield takeLatest(GET_NOTES_HOMEPAGE, getNotesForChapter);
	yield takeLatest(GET_COPYRIGHTS, getCopyrightSaga);
	yield takeLatest(DELETE_HIGHLIGHTS, deleteHighlights);
	yield takeLatest(CREATE_USER_WITH_SOCIAL_ACCOUNT, createSocialUser);
}
