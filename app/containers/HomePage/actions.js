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
	GET_LANGUAGES,
	LOAD_CHAPTER_TEXT,
	GET_CHAPTER_TEXT,
	SET_ACTIVE_TEXT,
	SET_LANGUAGES,
	TOGGLE_SETTINGS_MODAL,
} from './constants';

export const loadBooks = ({ books }) => ({
	type: LOAD_BOOKS,
	books,
});

export const loadChapter = ({ text }) => ({
	type: LOAD_CHAPTER_TEXT,
	text,
});

export const loadTexts = ({ texts }) => ({
	type: LOAD_TEXTS,
	texts,
});

export const getChapterText = ({ bible, book, chapter }) => ({
	type: GET_CHAPTER_TEXT,
	bible,
	book,
	chapter,
});

export const getTexts = () => ({
	type: GET_DPB_TEXTS,
});

export const getLanguages = () => ({
	type: GET_LANGUAGES,
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

export const toggleSettingsModal = () => ({
	type: TOGGLE_SETTINGS_MODAL,
});

export const setActiveBookName = (book) => ({
	type: SET_ACTIVE_BOOK_NAME,
	book,
});

export const setActiveText = ({ textName, textId }) => ({
	type: SET_ACTIVE_TEXT,
	textName,
	textId,
});

export const setLanguages = ({ languages }) => ({
	type: SET_LANGUAGES,
	languages,
});
