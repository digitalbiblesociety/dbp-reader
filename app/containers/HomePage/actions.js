/*
 *
 * HomePage actions
 *
 * TODO: Remove boilerplate by creating a function to create actions
 * Automatically pass through all props so these files are basically useless... -_-
 */

import {
	ACTIVE_TEXT_ID,
	SET_CHAPTER_TEXT_LOADING_STATE,
	ADD_HIGHLIGHTS,
	GET_BOOKS,
	GET_AUDIO,
	GET_CHAPTER_TEXT,
	GET_HIGHLIGHTS,
	SET_ACTIVE_NOTE,
	GET_NOTES_HOMEPAGE,
	GET_COPYRIGHTS,
	INIT_APPLICATION,
	LOAD_AUDIO,
	LOAD_CHAPTER_TEXT,
	SET_USER_AGENT,
	SET_ACTIVE_CHAPTER,
	SET_ACTIVE_BOOK_NAME,
	SET_ACTIVE_NOTES_VIEW,
	SET_SELECTED_BOOK_NAME,
	SET_AUDIO_PLAYER_STATE,
	TOGGLE_PROFILE,
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
	TOGGLE_AUTOPLAY,
	DELETE_HIGHLIGHTS,
	CREATE_USER_WITH_SOCIAL_ACCOUNT,
	RESET_BOOKMARK_STATE,
	CHANGING_VERSION,
} from './constants';

export const resetBookmarkState = (props) => ({
	type: RESET_BOOKMARK_STATE,
	...props,
});

export const setChapterTextLoadingState = (props) => ({
	type: SET_CHAPTER_TEXT_LOADING_STATE,
	...props,
});

export const setUA = () => ({
	type: SET_USER_AGENT,
});

export const createUserWithSocialAccount = (props) => ({
	type: CREATE_USER_WITH_SOCIAL_ACCOUNT,
	...props,
});

export const deleteHighlights = (props) => ({
	type: DELETE_HIGHLIGHTS,
	...props,
});

export const setAudioPlayerState = (state) => ({
	type: SET_AUDIO_PLAYER_STATE,
	state,
});

export const getNotes = (props) => ({
	type: GET_NOTES_HOMEPAGE,
	...props,
});

export const toggleAutoPlay = (props) => ({
	type: TOGGLE_AUTOPLAY,
	...props,
});

export const addHighlight = (props) => ({
	type: ADD_HIGHLIGHTS,
	...props,
});

export const toggleSettingsOptionAvailability = ({ path }) => ({
	type: TOGGLE_SETTINGS_OPTION_AVAILABILITY,
	path,
});

export const toggleSettingsOption = (props) => ({
	type: TOGGLE_SETTINGS_OPTION,
	...props,
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

export const loadAudio = ({ audioObjects }) => ({
	type: LOAD_AUDIO,
	audioObjects,
});

export const getBooks = (props) => ({
	type: GET_BOOKS,
	...props,
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

export const getCopyrights = (props) => ({
	type: GET_COPYRIGHTS,
	...props,
});

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

export const changeVersion = (props) => ({
	type: CHANGING_VERSION,
	...props,
});
