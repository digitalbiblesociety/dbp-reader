/*
 *
 * TextSelection reducer
 *
 */

import { fromJS } from 'immutable';
import {
	LOAD_TEXTS,
	LOAD_COUNTRIES,
	SET_COUNTRY_NAME,
	SET_LANGUAGES,
	SET_ISO_CODE,
	SET_VERSION_LIST_STATE,
	SET_LANGUAGE_LIST_STATE,
	SET_COUNTRY_LIST_STATE,
	unitedStates,
} from './constants';
// TODO: Ensure default state has a way of staying up to date
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
			filesets: {
				ENGESVC2DA: 'audio_drama',
				ENGESVC2ET: 'text_plain',
				ENGESVO2DA: 'audio_drama',
				ENGESVO2ET: 'text_plain',
				ENGGIDC1ET: 'text_plain',
				ENGGIDN2DA: 'audio_drama',
				ENGGIDN2ET: 'text_plain',
				ENGGIDO1DA: 'audio',
				ENGGIDO2DA: 'audio_drama',
				ENGGIDO2ET: 'text_plain',
			},
		},
	],
	countries: {
		'United States': unitedStates,
	},
	countryLanguages: [],
	languageListActive: false,
	versionListActive: true,
	countryListActive: false,
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
	case LOAD_COUNTRIES:
		return state.set('countries', fromJS(action.countries));
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
