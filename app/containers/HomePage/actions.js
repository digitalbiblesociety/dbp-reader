/*
 *
 * HomePage actions
 *
 */

import {
	ACTIVE_TEXT_ID,
	GET_BOOKS,
	SET_ACTIVE_NOTE,
	GET_AUDIO,
	GET_CHAPTER_TEXT,
	LOAD_BOOKS,
	LOAD_AUDIO,
	LOAD_CHAPTER_TEXT,
	SET_ACTIVE_CHAPTER,
	SET_ACTIVE_BOOK_NAME,
	SET_ACTIVE_NOTES_VIEW,
	SET_SELECTED_BOOK_NAME,
	TOGGLE_PROFILE,
	TOGGLE_MENU_BAR,
	TOGGLE_NOTES_MODAL,
	TOGGLE_SEARCH_MODAL,
	TOGGLE_SETTINGS_MODAL,
	TOGGLE_CHAPTER_SELECTION,
	TOGGLE_VERSION_SELECTION,
	TOGGLE_INFORMATION_MODAL,
	UPDATE_SELECTED_TEXT,
} from './constants';

export const setActiveNote = ({ note }) => ({
	type: SET_ACTIVE_NOTE,
	note,
});


export const setSelectedBookName = (book) => ({
	type: SET_SELECTED_BOOK_NAME,
	book,
});


export const updateSelectedText = ({ text }) => ({
	type: UPDATE_SELECTED_TEXT,
	text,
});

export const loadChapter = ({ text, audioSource }) => ({
	type: LOAD_CHAPTER_TEXT,
	text,
	audioSource,
});

export const loadBooksAndCopywrite = ({ books, copywrite }) => ({
	type: LOAD_BOOKS,
	books,
	copywrite,
});

export const loadAudio = ({ audioObjects }) => ({
	type: LOAD_AUDIO,
	audioObjects,
});

export const getBooks = ({ textId }) => ({
	type: GET_BOOKS,
	textId,
});

export const getAudio = ({ filesetId, list }) => ({
	type: GET_AUDIO,
	filesetId,
	list,
});

export const getChapterText = ({ bible, book, chapter, audioObjects }) => ({
	type: GET_CHAPTER_TEXT,
	bible,
	book,
	chapter,
	audioObjects,
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

export const toggleSearchModal = () => ({
	type: TOGGLE_SEARCH_MODAL,
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

export const setActiveTextId = ({ textName, textId, filesets }) => ({
	type: ACTIVE_TEXT_ID,
	textName,
	textId,
	filesets,
});

export const setActiveBookName = ({ book, id }) => ({
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
