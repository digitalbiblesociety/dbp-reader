import { take, cancel, takeLatest, call, fork, put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request from '../../utils/request';
import { getHighlights } from '../HomePage/saga';
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
	const chapter =
		typeof note.get === 'function' ? note.get('chapter') : note.chapter;
	const bibleId =
		typeof note.get === 'function' ? note.get('bible_id') : note.bible_id;
	const bookId =
		typeof note.get === 'function' ? note.get('book_id') : note.book_id;
	// TODO: The bibleId here is undefined a lot of the time, find where it gets passed in and fix the issue
	const bibleUrl = `${process.env.BASE_API_ROUTE}/bibles/${bibleId}?asset_id=${
		process.env.DBP_BUCKET_ID
	}&key=${process.env.DBP_API_KEY}&v=4`;
	// Need to get the bible filesets
	try {
		const response = yield call(request, bibleUrl);
		const filesets = response.data.filesets[process.env.DBP_BUCKET_ID].filter(
			(fileset) =>
				fileset.type !== 'app' &&
				(fileset.type === 'text_plain' || fileset.type === 'text_format'),
		);
		const hasText = !!filesets.length;
		const plain = filesets.find((fileset) => fileset.type === 'text_plain');
		let text = [];

		if (hasText) {
			if (plain) {
				const res = yield call(
					request,
					`${process.env.BASE_API_ROUTE}/bibles/filesets/${
						plain.id
					}/${bookId}/${chapter}?key=${
						process.env.DBP_API_KEY
					}&v=4&book_id=${bookId}&chapter_id=${chapter}`,
				);

				text = res.data;
			}
		}

		yield put({
			type: LOAD_CHAPTER_FOR_NOTE,
			text: text.filter(
				(verse) =>
					verse.verse_start <= note.verse_end &&
					verse.verse_start >= note.verse_start,
			),
		});
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('error getting chapter for note', err); // eslint-disable-line no-console
		}
	}
}

export function* updateHighlight({
	userId,
	id,
	color,
	bible,
	book,
	chapter,
	limit,
	page,
}) {
	const requestUrl = `${
		process.env.BASE_API_ROUTE
	}/users/${userId}/highlights/${id}?key=${
		process.env.DBP_API_KEY
	}&v=4&pretty&project_id=${
		process.env.NOTES_PROJECT_ID
	}&highlighted_color=${color}`;
	const options = {
		method: 'PUT',
	};

	try {
		const response = yield call(request, requestUrl, options);

		if (response.success) {
			yield fork(getHighlights, { userId, bible, book, chapter });
			yield fork(getUserHighlights, { userId, params: { limit, page } });
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

export function* getUserHighlights({ userId, params }) {
	const requestUrl = `${
		process.env.BASE_API_ROUTE
	}/users/${userId}/highlights?key=${
		process.env.DBP_API_KEY
	}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}&limit=${
		params.limit
	}&page=${params.page}`;

	try {
		const response = yield call(request, requestUrl);

		if (response.data && response.meta) {
			yield put({
				type: LOAD_USER_HIGHLIGHTS,
				highlights: response.data,
				activePage: response.meta.pagination.current_page,
				totalPages: response.meta.pagination.total_pages,
				pageSize: response.meta.pagination.per_page,
			});
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error getting user highlights', err); // eslint-disable-line no-console
		}
	}
}

export function* updateNote({ userId, data, noteId }) {
	const requestUrl = `${
		process.env.BASE_API_ROUTE
	}/users/${userId}/notes/${noteId}?key=${
		process.env.DBP_API_KEY
	}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const urlWithData = Object.entries(data).reduce(
		(acc, item) => acc.concat('&', item[0], '=', item[1]),
		requestUrl,
	);
	const options = {
		method: 'PUT',
	};

	try {
		const response = yield call(request, urlWithData, options);

		if (response.success) {
			yield put({ type: ADD_NOTE_SUCCESS, response });
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
		yield put({
			type: ADD_NOTE_FAILED,
			message: 'An error has occurred. Please try again later.',
		});
	}
}

export function* deleteNote({
	userId,
	noteId,
	pageSize,
	activePage,
	bibleId,
	bookId,
	chapter,
	isBookmark,
}) {
	if (isBookmark) {
		const requestUrl = `${
			process.env.BASE_API_ROUTE
		}/users/${userId}/bookmarks/${noteId}?key=${
			process.env.DBP_API_KEY
		}&v=4&pretty&note_id=${noteId}&project_id=${process.env.NOTES_PROJECT_ID}`;
		const options = {
			method: 'DELETE',
		};

		try {
			// Do not need the response since it will throw an error if the request was unsuccessful
			yield call(request, requestUrl, options);

			yield fork(getUserBookmarks, {
				userId,
				params: { limit: pageSize, page: activePage },
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
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.error(err); // eslint-disable-line no-console
			}
			yield put({
				type: ADD_NOTE_FAILED,
				message: 'An error has occurred. Please try again later.',
			});
		}
	} else {
		const requestUrl = `${
			process.env.BASE_API_ROUTE
		}/users/${userId}/notes/${noteId}?key=${
			process.env.DBP_API_KEY
		}&v=4&pretty&note_id=${noteId}&project_id=${process.env.NOTES_PROJECT_ID}`;
		const options = {
			method: 'DELETE',
		};

		try {
			const response = yield call(request, requestUrl, options);

			if (response.success) {
				if (isBookmark) {
					yield fork(getUserBookmarks, {
						userId,
						params: { limit: pageSize, page: activePage },
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
				yield fork(getNotesForNotebook, {
					userId,
					params: { limit: pageSize, page: activePage },
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
			}
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.error(err); // eslint-disable-line no-console
			}
			yield put({
				type: ADD_NOTE_FAILED,
				message: 'An error has occurred. Please try again later.',
			});
		}
	}
}
// Probably need a getBookmarks function
export function* getNotesForChapter({ userId, params = {} }) {
	// Need to adjust how I paginate the notes here and in other places as well
	const requestUrl = `${process.env.BASE_API_ROUTE}/users/${userId}/notes?key=${
		process.env.DBP_API_KEY
	}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const urlWithParams = Object.entries(params).reduce(
		(acc, param) => acc.concat(`&${param[0]}=${param[1]}`),
		requestUrl,
	);

	try {
		const response = yield call(request, urlWithParams);

		yield put({
			type: LOAD_USER_NOTES,
			listData: response.data || [],
		});
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error getting the notes', err); // eslint-disable-line no-console
		}
	}
}

export function* getNotesForNotebook({ userId, params = {} }) {
	// Need to adjust how I paginate the notes here and in other places as well
	const requestUrl = `${process.env.BASE_API_ROUTE}/users/${userId}/notes?key=${
		process.env.DBP_API_KEY
	}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const urlWithParams = Object.entries(params).reduce(
		(acc, param) => acc.concat(`&${param[0]}=${param[1]}`),
		requestUrl,
	);

	try {
		const response = yield call(request, urlWithParams);

		if (response.data && response.meta) {
			yield put({
				type: LOAD_NOTEBOOK_DATA,
				listData: response.data,
				activePage: response.meta.pagination.current_page,
				totalPages: response.meta.pagination.total_pages,
				pageSize: response.meta.pagination.per_page,
			});
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// Add bookmark is separate and is in the homepage saga file
export function* addNote({ userId, data }) {
	const requestUrl = `${process.env.BASE_API_ROUTE}/users/${userId}/notes?key=${
		process.env.DBP_API_KEY
	}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const formData = new FormData();

	Object.entries(data).forEach((item) => formData.set(item[0], item[1]));

	const options = {
		body: formData,
		method: 'POST',
	};

	try {
		const response = yield call(request, requestUrl, options);

		if (
			(response.meta && response.meta.success) ||
			(response.meta && !response.meta.error)
		) {
			yield put({ type: ADD_NOTE_SUCCESS, response });
			yield fork(getNotesForChapter, {
				userId: data.user_id,
				params: {
					bible_id: data.bible_id,
					book_id: data.book_id,
					chapter: data.chapter,
					limit: 150,
					page: 1,
				},
			});
		} else if (response.error) {
			yield put({ type: ADD_NOTE_FAILED, message: response.error.notes[0] });
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
		yield put({
			type: ADD_NOTE_FAILED,
			message: 'An error has occurred. Please try again later.',
		});
	}
}

export function* getBookmarksForChapter({ userId, params = {} }) {
	const requestUrl = `${
		process.env.BASE_API_ROUTE
	}/users/${userId}/bookmarks?key=${
		process.env.DBP_API_KEY
	}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const urlWithParams = Object.entries(params).reduce(
		(acc, param) => acc.concat(`&${param[0]}=${param[1]}`),
		requestUrl,
	);

	try {
		const response = yield call(request, urlWithParams);

		if (response.data) {
			yield put({
				type: LOAD_BOOKMARKS_FOR_CHAPTER,
				listData: response.data || [],
			});
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error('Error getting the notes', err); // eslint-disable-line no-console
		}
	}
}

export function* getUserBookmarks({ userId, params = {} }) {
	const requestUrl = `${
		process.env.BASE_API_ROUTE
	}/users/${userId}/bookmarks?key=${
		process.env.DBP_API_KEY
	}&v=4&pretty&project_id=${process.env.NOTES_PROJECT_ID}`;
	const urlWithParams = Object.entries(params).reduce(
		(acc, param) => acc.concat(`&${param[0]}=${param[1]}`),
		requestUrl,
	);

	try {
		const response = yield call(request, urlWithParams);

		if (response.data && response.meta) {
			yield put({
				type: LOAD_USER_BOOKMARK_DATA,
				listData: response.data,
				activePage: response.meta.pagination.current_page,
				totalPages: response.meta.pagination.total_pages,
				pageSize: response.meta.pagination.per_page,
			});
		}
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(err); // eslint-disable-line no-console
		}
	}
}

// Individual exports for testing
export default function* notesSaga() {
	const addNoteSaga = yield takeLatest(ADD_NOTE, addNote);
	const getNotesSaga = yield takeLatest(GET_USER_NOTES, getNotesForChapter);
	const updateNoteSaga = yield takeLatest(UPDATE_NOTE, updateNote);
	const updateHighlightSaga = yield takeLatest(
		UPDATE_HIGHLIGHT,
		updateHighlight,
	);
	const deleteNoteSaga = yield takeLatest(DELETE_NOTE, deleteNote);
	const getChapterSaga = yield takeLatest(
		GET_CHAPTER_FOR_NOTE,
		getChapterForNote,
	);
	const getNotebookSaga = yield takeLatest(
		GET_USER_NOTEBOOK_DATA,
		getNotesForNotebook,
	);
	const getUserHighlightsSaga = yield takeLatest(
		GET_USER_HIGHLIGHTS,
		getUserHighlights,
	);
	const getBookmarksForChapterSaga = yield takeLatest(
		GET_BOOKMARKS_FOR_CHAPTER,
		getBookmarksForChapter,
	);
	const getUserBookmarksSaga = yield takeLatest(
		GET_USER_BOOKMARK_DATA,
		getUserBookmarks,
	);

	yield take(LOCATION_CHANGE);
	yield cancel(addNoteSaga);
	yield cancel(getNotesSaga);
	yield cancel(getChapterSaga);
	yield cancel(updateNoteSaga);
	yield cancel(deleteNoteSaga);
	yield cancel(getNotebookSaga);
	yield cancel(updateHighlightSaga);
	yield cancel(getUserBookmarksSaga);
	yield cancel(getBookmarksForChapterSaga);
	yield cancel(getUserHighlightsSaga);
}
