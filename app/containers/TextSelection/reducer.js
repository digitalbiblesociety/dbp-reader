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
	GET_DPB_TEXTS,
	GET_LANGUAGES,
	GET_COUNTRIES,
} from './constants';
// TODO: Ensure default state has a way of staying up to date
const initialState = fromJS({
	languages: [],
	texts: [],
	countries: {},
	countryLanguages: [],
	languageListActive: false,
	versionListActive: true,
	countryListActive: false,
	activeLanguageName: 'ANY',
	activeCountryName: 'ANY',
	initialBookId: 'GEN',
	activeIsoCode: 'ANY',
	loadingCountries: false,
	loadingLanguages: false,
	loadingVersions: false,
});

function textSelectionReducer(state = initialState, action) {
	switch (action.type) {
	case GET_COUNTRIES:
		return state.set('loadingCountries', true);
	case GET_LANGUAGES:
		return state.set('loadingLanguages', true);
	case GET_DPB_TEXTS:
		return state.set('loadingVersions', true);
	case SET_LANGUAGE_LIST_STATE:
		return state.set('languageListActive', action.state);
	case SET_VERSION_LIST_STATE:
		return state.set('versionListActive', action.state);
	case SET_COUNTRY_LIST_STATE:
		return state.set('countryListActive', action.state);
	case LOAD_TEXTS:
		return state
			.set('loadingVersions', false)
			.set('texts', fromJS(action.texts));
	case LOAD_COUNTRIES:
		return state
			.set('loadingCountries', false)
			.set('countries', fromJS(action.countries));
	case SET_LANGUAGES:
		return state
			.set('loadingLanguages', false)
			.set('languages', fromJS(action.languages));
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
