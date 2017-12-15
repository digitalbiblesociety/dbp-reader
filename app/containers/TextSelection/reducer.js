/*
 *
 * TextSelection reducer
 *
 */

import { fromJS } from 'immutable';
import {
	LOAD_TEXTS,
	LOAD_BOOKS,
	SET_ACTIVE_TEXT,
	SET_LANGUAGES,
	SET_ISO_CODE,
	TOGGLE_VERSION_LIST,
	TOGGLE_LANGUAGE_LIST,
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
	books: [],
	languageListActive: false,
	versionListActive: false,
	bookTableActive: true,
	isChapterActive: false,
	activeLanguageName: 'English',
	activeTextName: 'ENGESV',
	activeTextId: 'ENGESV',
	initialBookId: 'GEN',
	activeIsoCode: 'eng',
});

function textSelectionReducer(state = initialState, action) {
	switch (action.type) {
	case TOGGLE_LANGUAGE_LIST:
		return state.set('languageListActive', !state.get('languageListActive'));
	case TOGGLE_VERSION_LIST:
		return state.set('versionListActive', !state.get('versionListActive'));
	case LOAD_TEXTS:
		return state.set('texts', fromJS(action.texts));
	case SET_ACTIVE_TEXT:
		return state
			.set('activeTextName', action.textName)
			.set('activeTextId', action.textId)
			.set('isBookTableActive', true)
			.set('isBibleTableActive', false)
			.set('activeBookName', '');
	case LOAD_BOOKS:
		return state
			.set('books', fromJS(action.books));
	case SET_LANGUAGES:
		return state.set('languages', fromJS(action.languages));
	case SET_ISO_CODE:
		return state
			.set('activeLanguageName', action.name)
			.set('activeIsoCode', action.iso);
	default:
		return state;
	}
}

export default textSelectionReducer;
