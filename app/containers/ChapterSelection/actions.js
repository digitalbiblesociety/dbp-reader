/*
 *
 * ChapterSelection actions
 *
 */

import {
	LOAD_BOOKS,
	SET_BOOK_LIST_STATE,
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

export const setBookListState = ({ state }) => ({
	type: SET_BOOK_LIST_STATE,
	state,
});
