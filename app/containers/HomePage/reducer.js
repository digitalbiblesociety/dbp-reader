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
	texts: [
		{
			abbr: 'ENGESV',
			name: 'English Standard Version',
			vname: 'English Standard Version',
			language: 'English',
			iso: 'eng',
			date: 2001,
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
		return state.set('activeIsoCode', action.isoCode);
	default:
		return state;
	}
}

export default homePageReducer;
