/*
 *
 * TextSelection reducer
 *
 */

import { fromJS } from 'immutable';
import {
	LOAD_TEXTS,
	SET_COUNTRY_NAME,
	SET_LANGUAGES,
	SET_ISO_CODE,
	SET_VERSION_LIST_STATE,
	SET_LANGUAGE_LIST_STATE,
	SET_COUNTRY_LIST_STATE,
} from './constants';

const initialState = fromJS({
	languages: [
		{
			glotto_code: 6414,
			iso_code: 'eng',
			name: 'English',
			count_bible: null,
		},
		{
			glotto_code: 6415,
			iso_code: 'deu',
			name: 'German',
			count_bible: null,
		},
		{
			glotto_code: 7892,
			iso_code: 'arb',
			name: 'Standard Arabic',
			count_bible: null,
		},
	],
	texts: [
		{
			abbr: 'ENGESV',
			name: 'English Standard Version',
			vname: 'English Standard Version',
			language: 'English',
			iso: 'eng',
			date: 2001,
		},
		{
			abbr: 'ENGASV',
			name: 'American Standard Version',
			vname: 'American Standard Version',
			language: 'English',
			iso: 'eng',
			date: 1901,
		},
		{
			abbr: 'DEUD05',
			name: 'German 1905 Darby Unrevidierte Elberfel',
			vname: 'German 1905 Darby Unrevidierte Elberfel',
			language: 'German',
			iso: 'deu',
			date: 1905,
		},
	],
	countryLanguages: [],
	languageListActive: false,
	versionListActive: false,
	countryListActive: true,
	activeLanguageName: 'English',
	activeCountryName: 'United States',
	initialBookId: 'GEN',
	activeIsoCode: 'eng',
});

function textSelectionReducer(state = initialState, action) {
	switch (action.type) {
	case SET_LANGUAGE_LIST_STATE:
		return state.set('languageListActive', action.state);
	case SET_VERSION_LIST_STATE:
		return state.set('versionListActive', action.state);
	case SET_COUNTRY_LIST_STATE:
		return state.set('countryListActive', action.state);
	case LOAD_TEXTS:
		return state.set('texts', fromJS(action.texts));
	case SET_LANGUAGES:
		return state.set('languages', fromJS(action.languages));
	case SET_COUNTRY_NAME:
		return state
			.set('countryLanguages', action.languages)
			.set('activeCountryName', action.name);
	case SET_ISO_CODE:
		return state
			.set('activeLanguageName', action.name)
			.set('activeIsoCode', action.iso);
	default:
		return state;
	}
}

export default textSelectionReducer;
