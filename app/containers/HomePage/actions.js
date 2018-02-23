/*
 *
 * HomePage actions
 *
 */

import {
	ACTIVE_TEXT_ID,
	ADD_HIGHLIGHTS,
	GET_BOOKS,
	GET_AUDIO,
	GET_CHAPTER_TEXT,
	GET_HIGHLIGHTS,
	SET_ACTIVE_NOTE,
	INIT_APPLICATION,
	LOAD_BOOKS,
	LOAD_AUDIO,
	LOAD_CHAPTER_TEXT,
	SET_ACTIVE_CHAPTER,
	SET_ACTIVE_BOOK_NAME,
	SET_ACTIVE_NOTES_VIEW,
	SET_SELECTED_BOOK_NAME,
	TOGGLE_PROFILE,
	// TOGGLE_MENU_BAR,
	TOGGLE_NOTES_MODAL,
	TOGGLE_SEARCH_MODAL,
	TOGGLE_SETTINGS_MODAL,
	TOGGLE_CHAPTER_SELECTION,
	TOGGLE_VERSION_SELECTION,
	TOGGLE_INFORMATION_MODAL,
	TOGGLE_FIRST_LOAD_TEXT_SELECTION,
	TOGGLE_SETTINGS_OPTION_AVAILABILITY,
	UPDATE_SELECTED_TEXT,
	TOGGLE_SETTINGS_OPTION,
} from './constants';

export const addHighlight = (props) => ({
	type: ADD_HIGHLIGHTS,
	...props,
});

export const toggleSettingsOptionAvailability = ({ path }) => ({
	type: TOGGLE_SETTINGS_OPTION_AVAILABILITY,
	path,
});

export const toggleSettingsOption = ({ path }) => ({
	type: TOGGLE_SETTINGS_OPTION,
	path,
});

export const initApplication = (props) => ({
	type: INIT_APPLICATION,
	...props,
});

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

export const loadChapter = (props) => ({
	type: LOAD_CHAPTER_TEXT,
	...props,
});

export const loadBooksAndCopywrite = (props) => ({
	type: LOAD_BOOKS,
	...props,
});

export const loadAudio = ({ audioObjects }) => ({
	type: LOAD_AUDIO,
	audioObjects,
});

export const getBooks = ({ textId, filesets }) => ({
	type: GET_BOOKS,
	textId,
	filesets,
});

export const getAudio = ({ filesetId, list }) => ({
	type: GET_AUDIO,
	filesetId,
	list,
});

export const getChapterText = (props) => ({
	type: GET_CHAPTER_TEXT,
	...props,
});

export const getHighlights = (props) => ({
	type: GET_HIGHLIGHTS,
	...props,
});

// export const toggleMenuBar = () => ({
// 	type: TOGGLE_MENU_BAR,
// });

export const toggleFirstLoadForTextSelection = () => ({
	type: TOGGLE_FIRST_LOAD_TEXT_SELECTION,
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

export const setActiveTextId = (props) => ({
	type: ACTIVE_TEXT_ID,
	...props,
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
