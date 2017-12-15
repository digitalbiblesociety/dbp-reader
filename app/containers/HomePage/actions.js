/*
 *
 * HomePage actions
 *
 */

import {
	SET_ACTIVE_BOOK_NAME,
	GET_CHAPTER_TEXT,
	TOGGLE_SETTINGS_MODAL,
	TOGGLE_TEXT_SELECTION,
} from './constants';

export const getChapterText = ({ bible, book, chapter }) => ({
	type: GET_CHAPTER_TEXT,
	bible,
	book,
	chapter,
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
