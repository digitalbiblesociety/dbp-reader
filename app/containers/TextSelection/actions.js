/*
 *
 * TextSelection actions
 *
 */

import {
	LOAD_TEXTS,
	GET_DPB_TEXTS,
	LOAD_BOOKS,
	GET_BOOKS,
	GET_LANGUAGES,
	SET_ACTIVE_TEXT,
	SET_LANGUAGES,
	SET_ISO_CODE,
	TOGGLE_LANGUAGE_LIST,
	TOGGLE_VERSION_LIST,
	SET_BOOK_LIST_STATE,
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

export const getLanguages = () => ({
	type: GET_LANGUAGES,
});

export const getBooks = ({ textId }) => ({
	type: GET_BOOKS,
	textId,
});

export const setBookListState = ({ state }) => ({
	type: SET_BOOK_LIST_STATE,
	state,
});

export const toggleLanguageList = () => ({
	type: TOGGLE_LANGUAGE_LIST,
});

export const toggleVersionList = () => ({
	type: TOGGLE_VERSION_LIST,
});

export const setActiveIsoCode = ({ iso, name }) => ({
	type: SET_ISO_CODE,
	iso,
	name,
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
