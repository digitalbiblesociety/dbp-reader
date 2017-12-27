/*
 *
 * TextSelection actions
 *
 */

import {
	LOAD_TEXTS,
	GET_DPB_TEXTS,
	GET_LANGUAGES,
	SET_LANGUAGES,
	SET_ISO_CODE,
	SET_LANGUAGE_LIST_STATE,
	SET_VERSION_LIST_STATE,
	SET_COUNTRY_LIST_STATE,
	SET_COUNTRY_NAME,
} from './constants';

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

export const setCountryListState = ({ state }) => ({
	type: SET_COUNTRY_LIST_STATE,
	state,
});

export const setCountryName = ({ name, languages }) => ({
	type: SET_COUNTRY_NAME,
	name,
	languages,
});

export const setLanguageListState = ({ state }) => ({
	type: SET_LANGUAGE_LIST_STATE,
	state,
});

export const setVersionListState = ({ state }) => ({
	type: SET_VERSION_LIST_STATE,
	state,
});

export const setActiveIsoCode = ({ iso, name }) => ({
	type: SET_ISO_CODE,
	iso,
	name,
});

export const setLanguages = ({ languages }) => ({
	type: SET_LANGUAGES,
	languages,
});
