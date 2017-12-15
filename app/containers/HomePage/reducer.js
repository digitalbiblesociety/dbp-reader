/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
	LOAD_TEXTS,
	TOGGLE_BIBLE_NAMES,
	TOGGLE_BOOK_NAMES,
	SET_ACTIVE_BOOK_NAME,
	LOAD_BOOKS,
	LOAD_CHAPTER_TEXT,
	SET_ACTIVE_TEXT,
	TOGGLE_SETTINGS_MODAL,
	SET_LANGUAGES, SET_ISO_CODE,
	TOGGLE_TEXT_SELECTION,
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
	chapterText: [],
	textSelectionActive: false,
	versionListActive: false,
	isChapterActive: false,
	activeTextName: 'ENGESV',
	bookTableActive: false,
	languageListActive: false,
	activeBookName: 'Genesis',
	activeTextId: 'ENGESV',
	initialBookId: 'GEN',
	activeIsoCode: 'eng',
	activeLanguageName: 'English',
	isSettingsModalActive: false,
});

function homePageReducer(state = initialState, action) {
	switch (action.type) {
	case TOGGLE_TEXT_SELECTION:
		return state.set('textSelectionActive', !state.get('textSelectionActive'));
	case TOGGLE_LANGUAGE_LIST:
		return state.set('languageListActive', !state.get('languageListActive'));
	case TOGGLE_VERSION_LIST:
		return state.set('versionListActive', !state.get('versionListActive'));
	case LOAD_TEXTS:
		return state.set('texts', fromJS(action.texts));
	case TOGGLE_BOOK_NAMES:
		return state
			.set('isBibleTableActive', false)
			.set('isBookTableActive', !state.get('isBookTableActive'));
	case TOGGLE_BIBLE_NAMES:
		return state
			.set('isBibleTableActive', !state.get('isBibleTableActive'))
			.set('isBookTableActive', false);
	case TOGGLE_SETTINGS_MODAL:
		return state
			.set('isSettingsModalActive', !state.get('isSettingsModalActive'))
			.set('isBookTableActive', false)
			.set('isBibleTableActive', false);
	case SET_ACTIVE_TEXT:
		return state
			.set('activeTextName', action.textName)
			.set('activeTextId', action.textId)
			.set('isBookTableActive', true)
			.set('isBibleTableActive', false)
			.set('activeBookName', '');
	case SET_ACTIVE_BOOK_NAME:
		return state.set('activeBookName', action.book);
	case LOAD_BOOKS:
		return state
			.set('books', fromJS(action.books));
	case LOAD_CHAPTER_TEXT:
		return state
			.set('isBookTableActive', false)
			.set('isBibleTableActive', false)
			.set('chapterText', fromJS(action.text))
			.set('isChapterActive', true);
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

export default homePageReducer;
