/*
 *
 * TextSelection reducer
 *
 */

import { fromJS } from 'immutable';
import { INIT_APPLICATION } from '../HomePage/constants';
import {
	LOAD_TEXTS,
	LOAD_COUNTRY,
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
	LOAD_COUNTRIES_ERROR,
	LOAD_VERSION_FOR_LANGUAGE,
} from './constants';

const initialState = fromJS({
	country: {},
	countries: {},
	texts: [],
	languages: [],
	countryLanguages: [],
	initialBookId: 'GEN',
	activeIsoCode: 'eng',
	activeLanguageName: '',
	activeCountryName: 'ANY',
	activeLanguageCode: 6414,
	versionListActive: true,
	loadingVersions: false,
	loadingCountries: false,
	loadingLanguages: false,
	countryListActive: false,
	languageListActive: false,
	loadingLanguageVersion: false,
	finishedLoadingCountries: false,
});

function textSelectionReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD_VERSION_FOR_LANGUAGE:
			return state.set('loadingLanguageVersion', action.state);
		case LOAD_COUNTRIES_ERROR:
			return state.set('finishedLoadingCountries', true);
		case INIT_APPLICATION:
			return state
				.set('loadingCountries', true)
				.set('loadingLanguages', true)
				.set('loadingVersions', true);
		case LOAD_COUNTRY:
			return state.set('country', fromJS(action.country));
		case GET_COUNTRIES:
			return state
				.set('loadingCountries', true)
				.set('finishedLoadingCountries', false);
		case GET_LANGUAGES:
			return state.set('loadingLanguages', true);
		case GET_DPB_TEXTS:
			return state.set('loadingVersions', true);
		case SET_LANGUAGE_LIST_STATE:
			return state
				.set('countryListActive', false)
				.set('versionListActive', false)
				.set('languageListActive', !state.get('languageListActive'));
		case SET_VERSION_LIST_STATE:
			return state
				.set('countryListActive', false)
				.set('languageListActive', false)
				.set('versionListActive', !state.get('versionListActive'));
		case SET_COUNTRY_LIST_STATE:
			return state
				.set('versionListActive', false)
				.set('languageListActive', false)
				.set('countryListActive', !state.get('countryListActive'));
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
				.set('activeIsoCode', action.iso)
				.set('activeLanguageCode', action.languageCode);
		default:
			return state;
	}
}

export default textSelectionReducer;
