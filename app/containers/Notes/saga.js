import { take, cancel, takeLatest, call, fork, put } from 'redux-saga/effects';
import request from 'utils/request';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
	getHighlights,
} from 'containers/HomePage/saga';
import {
	ADD_NOTE,
	ADD_NOTE_SUCCESS,
	ADD_NOTE_FAILED,
	UPDATE_NOTE,
	DELETE_NOTE,
	LOAD_USER_NOTES,
	GET_USER_NOTES,
	GET_CHAPTER_FOR_NOTE,
	LOAD_CHAPTER_FOR_NOTE,
	// SET_ACTIVE_PAGE_DATA,
	// SET_PAGE_SIZE,
	LOAD_NOTEBOOK_DATA,
	GET_USER_NOTEBOOK_DATA,
	LOAD_BOOKMARKS_FOR_CHAPTER,
	LOAD_USER_BOOKMARK_DATA,
	GET_BOOKMARKS_FOR_CHAPTER,
	GET_USER_BOOKMARK_DATA,
	GET_USER_HIGHLIGHTS,
	LOAD_USER_HIGHLIGHTS,
	UPDATE_HIGHLIGHT,
} from './constants';

export function* getChapterForNote({ note }) {
	const chapter = note.chapter;
	const bibleId = note.bible_id;
	const bookId = note.book_id;
	// Need to not use the bible id here
	// const reqUrl = `https://api.bible.build/bibles/${bibleId}/${bookId}/${chapter}?bucket=${process.env.DBP_BUCKET_ID}&key=${process.env.DBP_API_KEY}&v=4&book_id=${bookId}&chapter_id=${chapter}`;
	const bibleUrl = `https://api.bible.build/bibles/${bibleId}?bucket=${process.env.DBP_BUCKET_ID}&key=${process.env.DBP_API_KEY}&v=4`;
	// Need to get the bible filesets
	try {
		const response = yield call(request, bibleUrl);
		// console.log('bibles response', response);
		const filesets = response.data.filesets.filter((f) => f.bucket_id === 'dbp-dev' && f.set_type_code !== 'app' && (f.set_type_code === 'text_plain' || f.set_type_code === 'text_format'));
		const hasText = !!filesets.length;
		const plain = filesets.find((f) => f.set_type_code === 'text_plain');
		let text = [];

		if (hasText) {
			// console.log('hasText', hasText);
			if (plain) {
				// console.log('has plain', plain);
				const res = yield call(request, `https://api.bible.build/bibles/filesets/${plain.id}/${bookId}/${chapter}?bucket=${process.env.DBP_BUCKET_ID}&key=${process.env.DBP_API_KEY}&v=4&book_id=${bookId}&chapter_id=${chapter}`);
				text = res.data;
			} else {
				// Todo: Implement a version for getting the formatted text and parsing it
				// const format = filesets.find((f) => f.set_type_code === 'text_format');
				// const res = yield call(request, `https://api.bible.build/bibles/filesets/${format.id}?bucket=${process.env.DBP_BUCKET_ID}&key=${process.env.DBP_API_KEY}&v=4&book_id=${bookId}&chapter_id=${chapter}`);
				//
				// text = res.data;
			}
		}
		// console.log(response);

		yield put({ type: LOAD_CHAPTER_FOR_NOTE, text: text.filter((v) => v.verse_start <= note.verse_end && v.verse_start >= note.verse_start) });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('error getting chapter for note', err); // eslint-disable-line no-console
		}
	}
}

export function* updateHighlight({ userId, id, color, bible, book, chapter }) {
	const requestUrl = `https://api.bible.build/users/${userId}/highlights/${id}?key=${process.env.DBP_API_KEY}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}&highlighted_color=${color}`;
	// const formData = new FormData();
	// Api does not seem to handle the updating of the note when using form-data - currently the api wants x-www-form-urlencoded
	// Object.entries(data).forEach((item) => formData.set(item[0], item[1]));
	// const urlWithData = Object.entries(data).reduce((acc, item) => acc.concat('&', item[0], '=', item[1]), requestUrl);
	// formData.append('project_id', process.env.NOTES_PROJECT_ID);

	const options = {
		// body: formData,
		method: 'PUT',
	};
	// console.log('updating note with', data, '\nfor this id', userId);
	try {
		const response = yield call(request, requestUrl, options);
		// console.log('update user note response', response);
		if (response.success) {
			// yield put({ type: ADD_NOTE_SUCCESS, response });
			// console.log('Response', response);
			// console.log(data);
			// console.log(noteId);
			yield fork(getHighlights, { userId, bible, book, chapter });
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

export function* getUserHighlights({ userId, params }) {
	const requestUrl = `https://api.bible.build/users/${userId}/highlights?key=${process.env.DBP_API_KEY}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}&paginate=${params.limit}&page=${params.page}`;
	// const updatedUrl = params.reduce((a, c) => a.concat(c), requestUrl);
	try {
		const response = yield call(request, requestUrl);
		// console.log('highlight response', response);
		// console.log('update user note response', response);
		yield put({ type: LOAD_USER_HIGHLIGHTS, highlights: response.data, totalPages: parseInt(response.last_page, 10) });
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error getting user highlights', err); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('https://api.bible.build/error_logging', options);
		}
	}
}

export function* updateNote({ userId, data, noteId }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes/${noteId}?key=${process.env.DBP_API_KEY}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	// const formData = new FormData();
	// Api does not seem to handle the updating of the note when using form-data - currently the api wants x-www-form-urlencoded
	// Object.entries(data).forEach((item) => formData.set(item[0], item[1]));
	const urlWithData = Object.entries(data).reduce((acc, item) => acc.concat('&', item[0], '=', item[1]), requestUrl);
	// formData.append('project_id', process.env.NOTES_PROJECT_ID);

	const options = {
		// body: formData,
		method: 'PUT',
	};
	// console.log('updating note with', data, '\nfor this id', userId);
	try {
		const response = yield call(request, urlWithData, options);
		// console.log('update user note response', response);
		if (response.success) {
			yield put({ type: ADD_NOTE_SUCCESS, response });
			// console.log('Response', response);
			// console.log(data);
			// console.log(noteId);
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
		yield put({ type: ADD_NOTE_FAILED, message: 'An error has occurred. Please try again later.' });
	}
}

export function* deleteNote({ userId, noteId, pageSize, activePage }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes/${noteId}?key=${process.env.DBP_API_KEY}&v=4&pretty&note_id=${noteId}&project_id=${process.env.NOTES_PROJECT_ID}`;
	const options = {
		method: 'DELETE',
	};
	// console.log('deleting note for userid and noteid', userId, noteId);
	try {
		const response = yield call(request, requestUrl, options);

		if (response.success) {
			// console.log('successfully deleted note!', response);
			yield fork(getNotesForNotebook, { userId, params: { limit: pageSize, page: activePage } });
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	 header: 'POST',
			// 	 body: formData,
			// };
			// fetch('https://api.bible.build/error_logging', options);
		}
		yield put({ type: ADD_NOTE_FAILED, message: 'An error has occurred. Please try again later.' });
	}
}
// Probably need a getBookmarks function
export function* getNotesForChapter({ userId, params = {} }) {
	// Need to adjust how I paginate the notes here and in other places as well
	// response.current_page = activePage
	// response.per_page = perPage
	// pages = totalPages
	// notes = response.data
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.DBP_API_KEY}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const urlWithParams = Object.entries(params).reduce((acc, param) => acc.concat(`&${param[0]}=${param[1]}`), requestUrl);
	// console.log('params given to get note saga', params);
	// console.log('with params', urlWithParams);
	// console.log('Getting notes for chapter');
	// console.trace();
	try {
		const response = yield call(request, urlWithParams);
		// const noteData = {
		// 	notes: response.data,
		// 	page: response.current_page,
		// 	pageSize: response.per_page,
		// 	pages: response.total,
		// };
		// console.log('get note response current page, last page and per page', response.current_page, response.last_page, response.per_page);

		// console.log('get note response', response);
		yield put({
			type: LOAD_USER_NOTES,
			listData: response.data,
		});
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error getting the notes', err); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('https://api.bible.build/error_logging', options);
		}
	}
}

export function* getNotesForNotebook({ userId, params = {} }) {
	// Need to adjust how I paginate the notes here and in other places as well
	// response.current_page = activePage
	// response.per_page = perPage
	// pages = totalPages
	// notes = response.data
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.DBP_API_KEY}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const urlWithParams = Object.entries(params).reduce((acc, param) => acc.concat(`&${param[0]}=${param[1]}`), requestUrl);
	// console.log('params given to get note saga', params);
	// // console.log('with params', urlWithParams);
	// console.trace();
	// console.log('Getting notes for notebook');

	try {
		const response = yield call(request, urlWithParams);
		// const noteData = {
		// 	notes: response.data,
		// 	page: response.current_page,
		// 	pageSize: response.per_page,
		// 	pages: response.total,
		// };
		// console.log('get note response current page, last page and per page', response.current_page, response.last_page, response.per_page);

		yield put({
			type: LOAD_NOTEBOOK_DATA,
			listData: response.data,
			activePage: parseInt(response.current_page, 10),
			totalPages: parseInt(response.last_page, 10),
			pageSize: parseInt(response.per_page, 10),
		});
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

// Add bookmark is separate and is in the homepage saga file
export function* addNote({ userId, data }) {
	const requestUrl = `https://api.bible.build/users/${userId}/notes?key=${process.env.DBP_API_KEY}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const formData = new FormData();

	Object.entries(data).forEach((item) => formData.set(item[0], item[1]));
	// formData.append('project_id', process.env.NOTES_PROJECT_ID);

	const options = {
		body: formData,
		method: 'POST',
	};
	// console.log('Adding note for userid', userId, '\nwith data', data);
	try {
		const response = yield call(request, requestUrl, options);
		// console.log('add user note response', response);
		if (response.success) {
			yield put({ type: ADD_NOTE_SUCCESS, response });
			yield fork(getNotesForChapter, { userId: data.user_id, params: { bible_id: data.bible_id, book_id: data.book_id, chapter: data.chapter, limit: 150, page: 1 } });
		} else if (response.error) {
			yield put({ type: ADD_NOTE_FAILED, message: response.error.notes[0] });
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
		yield put({ type: ADD_NOTE_FAILED, message: 'An error has occurred. Please try again later.' });
	}
}

export function* getBookmarksForChapter({ userId, params = {} }) {
	// Need to adjust how I paginate the notes here and in other places as well
	// response.current_page = activePage
	// response.per_page = perPage
	// pages = totalPages
	// notes = response.data
	const requestUrl = `https://api.bible.build/users/${userId}/bookmarks?key=${process.env.DBP_API_KEY}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const urlWithParams = Object.entries(params).reduce((acc, param) => acc.concat(`&${param[0]}=${param[1]}`), requestUrl);
	// console.log('params given to get note saga', params);
	// console.log('with params', urlWithParams);
	// console.log('Getting bookmarks for chapter');
	// console.trace();
	try {
		const response = yield call(request, urlWithParams);
		// const noteData = {
		// 	notes: response.data,
		// 	page: response.current_page,
		// 	pageSize: response.per_page,
		// 	pages: response.total,
		// };
		// console.log('get note response current page, last page and per page', response.current_page, response.last_page, response.per_page);

		// console.log('get bookmarks response', response);
		yield put({
			type: LOAD_BOOKMARKS_FOR_CHAPTER,
			listData: response.data,
		});
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error getting the notes', err); // eslint-disable-line no-console
		} else if (process.env.NODE_ENV === 'production') {
			// const options = {
			// 	header: 'POST',
			// 	body: formData,
			// };
			// fetch('https://api.bible.build/error_logging', options);
		}
	}
}

export function* getUserBookmarks({ userId, params = {} }) {
	// Need to adjust how I paginate the notes here and in other places as well
	// response.current_page = activePage
	// response.per_page = perPage
	// pages = totalPages
	// notes = response.data
	const requestUrl = `https://api.bible.build/users/${userId}/bookmarks?key=${process.env.DBP_API_KEY}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const urlWithParams = Object.entries(params).reduce((acc, param) => acc.concat(`&${param[0]}=${param[1]}`), requestUrl);
	// console.log('params given to get note saga', params);
	// // console.log('with params', urlWithParams);
	// console.trace();
	// console.log('Getting bookmarks for notebook');

	try {
		const response = yield call(request, urlWithParams);
		// const noteData = {
		// 	notes: response.data,
		// 	page: response.current_page,
		// 	pageSize: response.per_page,
		// 	pages: response.total,
		// };
		// console.log('get note response current page, last page and per page', response.current_page, response.last_page, response.per_page);

		yield put({
			type: LOAD_USER_BOOKMARK_DATA,
			listData: response.data,
			activePage: parseInt(response.current_page, 10),
			totalPages: parseInt(response.last_page, 10),
			pageSize: parseInt(response.per_page, 10),
		});
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

// Individual exports for testing
export default function* notesSaga() {
	const addNoteSaga = yield takeLatest(ADD_NOTE, addNote);
	const getNotesSaga = yield takeLatest(GET_USER_NOTES, getNotesForChapter);
	const updateNoteSaga = yield takeLatest(UPDATE_NOTE, updateNote);
	const updateHighlightSaga = yield takeLatest(UPDATE_HIGHLIGHT, updateHighlight);
	const deleteNoteSaga = yield takeLatest(DELETE_NOTE, deleteNote);
	const getChapterSaga = yield takeLatest(GET_CHAPTER_FOR_NOTE, getChapterForNote);
	const getNotebookSaga = yield takeLatest(GET_USER_NOTEBOOK_DATA, getNotesForNotebook);
	const getUserHighlightsSaga = yield takeLatest(GET_USER_HIGHLIGHTS, getUserHighlights);
	// const setPageSize = yield takeLatest(SET_PAGE_SIZE, getNotesForNotebook);
	// const setActivePage = yield takeLatest(SET_ACTIVE_PAGE_DATA, getNotesForNotebook);
	const getBookmarksForChapterSaga = yield takeLatest(GET_BOOKMARKS_FOR_CHAPTER, getBookmarksForChapter);
	const getUserBookmarksSaga = yield takeLatest(GET_USER_BOOKMARK_DATA, getUserBookmarks);
	// console.log('Loaded notes saga');
	yield take(LOCATION_CHANGE);
	yield cancel(addNoteSaga);
	yield cancel(getNotesSaga);
	yield cancel(getChapterSaga);
	yield cancel(updateNoteSaga);
	yield cancel(deleteNoteSaga);
	// yield cancel(setPageSize);
	// yield cancel(setActivePage);
	yield cancel(getNotebookSaga);
	yield cancel(updateHighlightSaga);
	yield cancel(getUserBookmarksSaga);
	yield cancel(getBookmarksForChapterSaga);
	yield cancel(getUserHighlightsSaga);
}
