/*
 *
 * TextSelection actions
 *
 */

import {
	LOAD_TEXTS,
	LOAD_COUNTRY,
	LOAD_COUNTRIES,
	GET_COUNTRY,
	GET_DPB_TEXTS,
	GET_LANGUAGES,
	GET_COUNTRIES,
	SET_LANGUAGES,
	SET_ISO_CODE,
	SET_LANGUAGE_LIST_STATE,
	SET_VERSION_LIST_STATE,
	SET_COUNTRY_LIST_STATE,
	SET_COUNTRY_NAME,
} from './constants';

export const loadCountry = (props) => ({
	type: LOAD_COUNTRY,
	...props,
});

export const loadTexts = ({ texts }) => ({
	type: LOAD_TEXTS,
	texts,
});

export const loadCountries = ({ countries }) => ({
	type: LOAD_COUNTRIES,
	countries,
});

export const getTexts = (props) => ({
	type: GET_DPB_TEXTS,
	...props,
});

export const getLanguages = () => ({
	type: GET_LANGUAGES,
});

export const getCountry = () => ({
	type: GET_COUNTRY,
});

export const getCountries = () => ({
	type: GET_COUNTRIES,
});

export const setCountryListState = () => ({
	type: SET_COUNTRY_LIST_STATE,
});

export const setCountryName = ({ name, languages }) => ({
	type: SET_COUNTRY_NAME,
	name,
	languages,
});

export const setLanguageListState = () => ({
	type: SET_LANGUAGE_LIST_STATE,
});

export const setVersionListState = () => ({
	type: SET_VERSION_LIST_STATE,
});

export const setActiveIsoCode = (props) => ({
	type: SET_ISO_CODE,
	...props,
});

export const setLanguages = ({ languages }) => ({
	type: SET_LANGUAGES,
	languages,
});
