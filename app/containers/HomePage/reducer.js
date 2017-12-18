/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SET_ACTIVE_BOOK_NAME,
	LOAD_CHAPTER_TEXT,
	TOGGLE_SETTINGS_MODAL,
	TOGGLE_TEXT_SELECTION,
	TOGGLE_MENU_BAR, SET_ACTIVE_CHAPTER,
} from './constants';

const initialState = fromJS({
	chapterText: [],
	activeChapter: 1,
	textSelectionActive: false,
	isChapterActive: false,
	isMenuBarActive: false,
	activeBookName: 'Genesis',
	activeTextId: 'ENGESV',
	initialBookId: 'GEN',
	isSettingsModalActive: false,
});

function homePageReducer(state = initialState, action) {
	switch (action.type) {
	case TOGGLE_MENU_BAR:
		return state.set('isMenuBarActive', !state.get('isMenuBarActive'));
	case TOGGLE_TEXT_SELECTION:
		return state
			.set('textSelectionActive', !state.get('textSelectionActive'))
			.set('isSettingsModalActive', false);
	case TOGGLE_SETTINGS_MODAL:
		return state
			.set('isSettingsModalActive', !state.get('isSettingsModalActive'))
			.set('textSelectionActive', false);
	case SET_ACTIVE_BOOK_NAME:
		return state.set('activeBookName', action.book);
	case SET_ACTIVE_CHAPTER:
		return state.set('activeChapter', action.chapter);
	case LOAD_CHAPTER_TEXT:
		return state
			.set('chapterText', fromJS(action.text))
			.set('isChapterActive', true);
	default:
		return state;
	}
}

export default homePageReducer;
