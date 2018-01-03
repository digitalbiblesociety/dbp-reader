/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SET_ACTIVE_BOOK_NAME,
	LOAD_CHAPTER_TEXT,
	LOAD_BOOKS,
	TOGGLE_SETTINGS_MODAL,
	TOGGLE_CHAPTER_SELECTION,
	TOGGLE_MENU_BAR,
	TOGGLE_VERSION_SELECTION,
	TOGGLE_PROFILE,
	SET_ACTIVE_CHAPTER,
	ACTIVE_TEXT_ID,
	TOGGLE_NOTES_MODAL,
} from './constants';

const initialState = fromJS({
	books: [],
	chapterText: [],
	activeChapter: 1,
	isChapterSelectionActive: false,
	isMenuBarActive: false,
	isProfileActive: false,
	activeBookName: 'Genesis',
	activeTextName: 'ENGESV',
	activeTextId: 'ENGESV',
	activeBookId: 'GEN',
	isSettingsModalActive: false,
	isNotesModalActive: false,
	isVersionSelectionActive: false,
});

function homePageReducer(state = initialState, action) {
	switch (action.type) {
	case LOAD_BOOKS:
		return state
			.set('books', fromJS(action.books));
	case TOGGLE_MENU_BAR:
		return state.set('isMenuBarActive', !state.get('isMenuBarActive'));
	case TOGGLE_PROFILE:
		return state.set('isProfileActive', !state.get('isProfileActive'));
	case TOGGLE_CHAPTER_SELECTION:
		return state.set('isChapterSelectionActive', !state.get('isChapterSelectionActive'));
	case TOGGLE_SETTINGS_MODAL:
		return state.set('isSettingsModalActive', !state.get('isSettingsModalActive'));
	case TOGGLE_NOTES_MODAL:
		return state.set('isNotesModalActive', !state.get('isNotesModalActive'));
	case TOGGLE_VERSION_SELECTION:
		return state.set('isVersionSelectionActive', !(state.get('isVersionSelectionActive')));
	case SET_ACTIVE_BOOK_NAME:
		return state
			.set('activeBookId', action.id)
			.set('activeBookName', action.book);
	case SET_ACTIVE_CHAPTER:
		return state.set('activeChapter', action.chapter);
	case ACTIVE_TEXT_ID:
		return state
			.set('activeTextName', action.textName)
			.set('activeTextId', action.textId);
	case LOAD_CHAPTER_TEXT:
		return state.set('chapterText', fromJS(action.text));
	default:
		return state;
	}
}

export default homePageReducer;
