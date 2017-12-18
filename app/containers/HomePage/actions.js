/*
 *
 * HomePage actions
 *
 */

import {
	SET_ACTIVE_BOOK_NAME,
	LOAD_CHAPTER_TEXT,
	GET_CHAPTER_TEXT,
	TOGGLE_SETTINGS_MODAL,
	TOGGLE_TEXT_SELECTION,
	TOGGLE_MENU_BAR, SET_ACTIVE_CHAPTER,
} from './constants';

export const loadChapter = ({ text }) => ({
	type: LOAD_CHAPTER_TEXT,
	text,
});

export const getChapterText = ({ bible, book, chapter }) => ({
	type: GET_CHAPTER_TEXT,
	bible,
	book,
	chapter,
});

export const toggleMenuBar = () => ({
	type: TOGGLE_MENU_BAR,
});

export const toggleSettingsModal = () => ({
	type: TOGGLE_SETTINGS_MODAL,
});

export const toggleTextSelection = () => ({
	type: TOGGLE_TEXT_SELECTION,
});

export const setActiveBookName = (book) => ({
	type: SET_ACTIVE_BOOK_NAME,
	book,
});

export const setActiveChapter = (chapter) => ({
	type: SET_ACTIVE_CHAPTER,
	chapter,
});
