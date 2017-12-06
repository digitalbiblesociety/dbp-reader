/*
 *
 * HomePage actions
 *
 */

import {
	LOAD_TEXTS,
	GET_DPB_TEXTS,
	TOGGLE_BIBLE_NAMES,
	TOGGLE_BOOK_NAMES,
	SET_ACTIVE_BOOK_NAME,
	LOAD_BOOKS,
	GET_BOOKS,
} from './constants';

export const loadBooks = ({ books }) => ({
	type: LOAD_BOOKS,
	books,
});

export const loadTexts = ({ texts }) => ({
	type: LOAD_TEXTS,
	texts,
});

export const getTexts = () => ({
	type: GET_DPB_TEXTS,
});

export const getBooks = ({ textId }) => ({
	type: GET_BOOKS,
	textId,
});

export const toggleBookNames = () => ({
	type: TOGGLE_BOOK_NAMES,
});

export const toggleBibleNames = () => ({
	type: TOGGLE_BIBLE_NAMES,
});

export const setActiveBookName = (book) => ({
	type: SET_ACTIVE_BOOK_NAME,
	book,
});
