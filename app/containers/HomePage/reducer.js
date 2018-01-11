/*
 *
 * HomePage reducer
 *
 * Use userSettings.toggleOptions.available for determining which
 * options a user has available within their settings.
 */

import { fromJS } from 'immutable';
import {
	SET_ACTIVE_BOOK_NAME,
	LOAD_CHAPTER_TEXT,
	LOAD_BOOKS,
	LOAD_AUDIO,
	TOGGLE_SETTINGS_MODAL,
	TOGGLE_CHAPTER_SELECTION,
	TOGGLE_MENU_BAR,
	TOGGLE_VERSION_SELECTION,
	TOGGLE_PROFILE,
	SET_ACTIVE_CHAPTER,
	SET_ACTIVE_NOTES_VIEW,
	ACTIVE_TEXT_ID,
	TOGGLE_NOTES_MODAL,
	TOGGLE_INFORMATION_MODAL,
	UPDATE_THEME,
	UPDATE_FONT_TYPE,
	UPDATE_FONT_SIZE,
	TOGGLE_READERS_MODE,
	TOGGLE_CROSS_REFERENCES,
	TOGGLE_RED_LETTER,
	TOGGLE_JUSTIFIED_TEXT,
	TOGGLE_ONE_VERSE_PER_LINE,
	TOGGLE_VERTICAL_SCROLLING,
} from './constants';

const initialState = fromJS({
	books: [],
	chapterText: [],
	audioObjects: [],
	activeFilesets: {},
	copywrite: {
		mark: 'Good News Publishers, Crossway Bibles',
		name: 'English Standard Version',
		date: '2001',
		country: 'United Kingdom',
	},
	activeChapter: 1,
	isChapterSelectionActive: false,
	isMenuBarActive: false,
	isProfileActive: false,
	isSettingsModalActive: false,
	isNotesModalActive: false,
	isVersionSelectionActive: false,
	isInformationModalActive: false,
	formattedTextActive: false,
	activeBookName: 'Genesis',
	activeTextName: 'ENGESV',
	activeNotesView: 'notes',
	activeTextId: 'ENGESV',
	activeBookId: 'GEN',
	userSettings: {
		activeTheme: 'default',
		activeFontType: 'sans',
		activeFontSize: 4,
		toggleOptions: {
			readersMode: {
				name: 'READER\'S MODE',
				active: false,
				available: true,
			},
			crossReferences: {
				name: 'CROSS REFERENCE',
				active: false,
				available: true,
			},
			redLetter: {
				name: 'RED LETTER',
				active: false,
				available: true,
			},
			justifiedText: {
				name: 'JUSTIFIED TEXT',
				active: false,
				available: true,
			},
			oneVersePerLine: {
				name: 'ONE VERSE PER LINE',
				active: false,
				available: true,
			},
			verticalScrolling: {
				name: 'VERTICAL SCROLLING',
				active: false,
				available: true,
			},
		},
	},
});

function homePageReducer(state = initialState, action) {
	switch (action.type) {
	case LOAD_BOOKS:
		return state
			.set('copywrite', fromJS(action.copywrite))
			.set('books', fromJS(action.books));
	case LOAD_AUDIO:
		return state.set('audioObjects', fromJS(action.audioObjects));
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
	case TOGGLE_INFORMATION_MODAL:
		return state.set('isInformationModalActive', !(state.get('isInformationModalActive')));
	case SET_ACTIVE_BOOK_NAME:
		return state
			.set('activeBookId', action.id)
			.set('activeBookName', action.book);
	case SET_ACTIVE_CHAPTER:
		return state.set('activeChapter', action.chapter);
	case ACTIVE_TEXT_ID:
		if (action.textName === 'ENGKJV') {
			return state
				.set('formattedTextActive', true)
				.set('activeFilesets', fromJS(action.filesets))
				.set('activeTextName', action.textName)
				.set('activeTextId', action.textId);
		}
		return state
			.set('formattedTextActive', false)
			.set('activeFilesets', fromJS(action.filesets))
			.set('activeTextName', action.textName)
			.set('activeTextId', action.textId);
	case LOAD_CHAPTER_TEXT:
		return state.set('chapterText', fromJS(action.text));
	case SET_ACTIVE_NOTES_VIEW:
		return state.set('activeNotesView', action.view);
	case UPDATE_THEME:
		return state.setIn(['userSettings', 'activeTheme'], action.theme);
	case UPDATE_FONT_TYPE:
		return state.setIn(['userSettings', 'activeFontType'], action.font);
	case UPDATE_FONT_SIZE:
		return state.setIn(['userSettings', 'activeFontSize'], action.size);
	case TOGGLE_READERS_MODE:
		return state.setIn(['userSettings', 'toggleOptions', 'readersMode', 'active'], !state.getIn(['userSettings', 'toggleOptions', 'readersMode', 'active']));
	case TOGGLE_CROSS_REFERENCES:
		return state.setIn(['userSettings', 'toggleOptions', 'crossReferences', 'active'], !state.getIn(['userSettings', 'toggleOptions', 'crossReferences', 'active']));
	case TOGGLE_RED_LETTER:
		return state.setIn(['userSettings', 'toggleOptions', 'redLetter', 'active'], !state.getIn(['userSettings', 'toggleOptions', 'redLetter', 'active']));
	case TOGGLE_JUSTIFIED_TEXT:
		return state.setIn(['userSettings', 'toggleOptions', 'justifiedText', 'active'], !state.getIn(['userSettings', 'toggleOptions', 'justifiedText', 'active']));
	case TOGGLE_ONE_VERSE_PER_LINE:
		return state.setIn(['userSettings', 'toggleOptions', 'oneVersePerLine', 'active'], !state.getIn(['userSettings', 'toggleOptions', 'oneVersePerLine', 'active']));
	case TOGGLE_VERTICAL_SCROLLING:
		return state.setIn(['userSettings', 'toggleOptions', 'verticalScrolling', 'active'], !state.getIn(['userSettings', 'toggleOptions', 'verticalScrolling', 'active']));
	default:
		return state;
	}
}

export default homePageReducer;
