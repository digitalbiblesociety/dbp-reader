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
