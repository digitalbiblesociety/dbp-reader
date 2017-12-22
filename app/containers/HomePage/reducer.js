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
	TOGGLE_CHAPTER_SELECTION,
	TOGGLE_MENU_BAR,
	TOGGLE_VERSION_SELECTION,
	TOGGLE_PROFILE,
	SET_ACTIVE_CHAPTER,
} from './constants';

const initialState = fromJS({
	chapterText: [],
	activeChapter: 1,
	isChapterSelectionActive: false,
	isChapterActive: false,
	isMenuBarActive: false,
	isProfileActive: false,
	activeBookName: 'Genesis',
	activeTextId: 'ENGESV',
	initialBookId: 'GEN',
	isSettingsModalActive: false,
	isVersionSelectionActive: false,
});

function homePageReducer(state = initialState, action) {
	switch (action.type) {
	case TOGGLE_MENU_BAR:
		return state.set('isMenuBarActive', !state.get('isMenuBarActive'));
	case TOGGLE_PROFILE:
		return state.set('isProfileActive', !state.get('isProfileActive'));
	case TOGGLE_CHAPTER_SELECTION:
		return state
			.set('isChapterSelectionActive', !state.get('isChapterSelectionActive'))
			.set('isVersionSelectionActive', false)
			.set('isSettingsModalActive', false);
	case TOGGLE_SETTINGS_MODAL:
		return state
			.set('isSettingsModalActive', !state.get('isSettingsModalActive'))
			.set('isVersionSelectionActive', false)
			.set('isChapterSelectionActive', false);
	case TOGGLE_VERSION_SELECTION:
		return state
			.set('isSettingsModalActive', false)
			.set('isChapterSelectionActive', false)
			.set('isVersionSelectionActive', !(state.get('isVersionSelectionActive')));
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
