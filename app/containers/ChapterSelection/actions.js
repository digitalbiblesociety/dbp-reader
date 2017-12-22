/*
 *
 * ChapterSelection actions
 *
 */

import {
	LOAD_BOOKS,
	SET_SELECTED_BOOK_NAME,
	GET_BOOKS,
} from './constants';

export const loadBooks = ({ books }) => ({
	type: LOAD_BOOKS,
	books,
});

export const getBooks = ({ textId }) => ({
	type: GET_BOOKS,
	textId,
});

export const setSelectedBookName = (book) => ({
	type: SET_SELECTED_BOOK_NAME,
	book,
});
