/*
 *
 * HomePage actions
 *
 */

import {
	SET_ACTIVE_BOOK_NAME,
	LOAD_CHAPTER_TEXT,
	GET_BOOKS,
	LOAD_BOOKS,
	GET_AUDIO,
	LOAD_AUDIO,
	GET_CHAPTER_TEXT,
	TOGGLE_NOTES_MODAL,
	TOGGLE_SETTINGS_MODAL,
	TOGGLE_CHAPTER_SELECTION,
	TOGGLE_PROFILE,
	TOGGLE_MENU_BAR,
	SET_ACTIVE_CHAPTER,
	SET_ACTIVE_NOTES_VIEW,
	TOGGLE_VERSION_SELECTION,
	ACTIVE_TEXT_ID,
	TOGGLE_INFORMATION_MODAL,
} from './constants';

export const loadChapter = ({ text }) => ({
	type: LOAD_CHAPTER_TEXT,
	text,
});

export const loadBooksAndCopywrite = ({ books, copywrite }) => ({
	type: LOAD_BOOKS,
	books,
	copywrite,
});

export const loadAudio = (stuff) => ({
	type: LOAD_AUDIO,
	...stuff,
});

export const getBooks = ({ textId }) => ({
	type: GET_BOOKS,
	textId,
});

export const getAudio = ({ filesetId }) => ({
	type: GET_AUDIO,
	filesetId,
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

export const toggleProfile = () => ({
	type: TOGGLE_PROFILE,
});

export const toggleSettingsModal = () => ({
	type: TOGGLE_SETTINGS_MODAL,
});

export const toggleNotesModal = () => ({
	type: TOGGLE_NOTES_MODAL,
});

export const toggleChapterSelection = () => ({
	type: TOGGLE_CHAPTER_SELECTION,
});

export const toggleVersionSelection = () => ({
	type: TOGGLE_VERSION_SELECTION,
});

export const toggleInformationModal = () => ({
	type: TOGGLE_INFORMATION_MODAL,
});

export const setActiveTextId = ({ textName, textId }) => ({
	type: ACTIVE_TEXT_ID,
	textName,
	textId,
});

export const setActiveBookName = (book, id) => ({
	type: SET_ACTIVE_BOOK_NAME,
	book,
	id,
});

export const setActiveChapter = (chapter) => ({
	type: SET_ACTIVE_CHAPTER,
	chapter,
});

export const setActiveNotesView = (view) => ({
	type: SET_ACTIVE_NOTES_VIEW,
	view,
});
