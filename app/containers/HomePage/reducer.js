/*
 *
 * HomePage reducer
 *
 * Use userSettings.toggleOptions.available for determining which
 * options a user has available within their settings.
 */

import { fromJS } from 'immutable';
// import esvDefaultFilesets from 'utils/defaultFilesetsForESV.json';
import {
	ACTIVE_TEXT_ID,
	LOAD_AUDIO,
	LOAD_BOOKS,
	LOAD_CHAPTER_TEXT,
	LOAD_HIGHLIGHTS,
	SET_ACTIVE_CHAPTER,
	SET_ACTIVE_BOOK_NAME,
	SET_ACTIVE_NOTES_VIEW,
	SET_SELECTED_BOOK_NAME,
	TOGGLE_PROFILE,
	TOGGLE_NOTES_MODAL,
	TOGGLE_SEARCH_MODAL,
	TOGGLE_SETTINGS_MODAL,
	TOGGLE_SETTINGS_OPTION,
	TOGGLE_INFORMATION_MODAL,
	TOGGLE_VERSION_SELECTION,
	TOGGLE_CHAPTER_SELECTION,
	TOGGLE_FIRST_LOAD_TEXT_SELECTION,
	TOGGLE_SETTINGS_OPTION_AVAILABILITY,
	UPDATE_THEME,
	UPDATE_FONT_TYPE,
	UPDATE_FONT_SIZE,
	SET_ACTIVE_NOTE,
	UPDATE_SELECTED_TEXT,
	GET_BOOKS,
	GET_CHAPTER_TEXT,
} from './constants';

const initialState = fromJS({
	books: [],
	note: {},
	chapterText: [],
	audioObjects: [],
	activeFilesets: {},
	highlights: [],
	copywrite: {
		mark: 'Good News Publishers, Crossway Bibles',
		name: 'English Standard Version',
		date: '2001',
		country: 'United Kingdom',
	},
	activeChapter: 1,
	isChapterSelectionActive: false,
	isProfileActive: false,
	isSettingsModalActive: false,
	isSearchModalActive: false,
	isNotesModalActive: false,
	isVersionSelectionActive: false,
	isInformationModalActive: false,
	activeBookName: 'Genesis',
	activeTextName: 'English Standard Version',
	activeNotesView: 'notes',
	activeTextId: 'ENGESV',
	defaultLanguageIso: 'eng',
	activeBookId: 'GEN',
	userSettings: {
		activeTheme: 'red',
		activeFontType: 'sans',
		activeFontSize: 3,
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
				active: true,
				available: true,
			},
			justifiedText: {
				name: 'JUSTIFIED TEXT',
				active: true,
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
	loadingBooks: false,
	selectedText: '',
	selectedBookName: 'Genesis',
	audioSource: '',
	formattedSource: '',
	hasTextInDatabase: true,
	filesetTypes: {},
	firstLoad: true,
});

function homePageReducer(state = initialState, action) {
	switch (action.type) {
	case TOGGLE_FIRST_LOAD_TEXT_SELECTION:
		return state.set('firstLoad', false);
	case GET_CHAPTER_TEXT:
		return state.set('loadingNewChapterText', true);
	case GET_BOOKS:
		return state
			.set('loadingNewChapterText', true)
			.set('loadingBooks', true);
	case LOAD_BOOKS:
		// Setting the active book name based on whether a name was introduced via
		// the bookId in the url, this was the best I could come up with
		return state
			.set('loadingBooks', false)
			.set('hasTextInDatabase', action.hasTextInDatabase)
			.set('filesetTypes', fromJS(action.filesetTypes))
			.set('copywrite', fromJS(action.copywrite))
			.set('activeBookName', action.activeBookName || state.get('activeBookName'))
			.set('books', fromJS(action.books));
	case LOAD_AUDIO:
		return state.set('audioObjects', fromJS(action.audioObjects));
	case SET_ACTIVE_NOTE:
		return state.set('note', fromJS(action.note));
	case TOGGLE_PROFILE:
		return state.set('isProfileActive', !state.get('isProfileActive'));
	case TOGGLE_CHAPTER_SELECTION:
		return state.set('isChapterSelectionActive', !state.get('isChapterSelectionActive'));
	case TOGGLE_SETTINGS_MODAL:
		return state.set('isSettingsModalActive', !state.get('isSettingsModalActive'));
	case TOGGLE_SEARCH_MODAL:
		return state.set('isSearchModalActive', !state.get('isSearchModalActive'));
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
		return state
			.set('activeFilesets', fromJS(action.filesets))
			.set('activeTextName', action.textName)
			.set('activeTextId', action.textId);
	case LOAD_CHAPTER_TEXT:
		if (action.formattedSource) {
			return state
				.set('loadingNewChapterText', false)
				.set('audioSource', action.audioSource)
				.set('formattedSource', action.formattedSource)
				.set('highlights', fromJS(action.highlights))
				.setIn(['userSettings', 'toggleOptions', 'crossReferences', 'active'], true)
				.set('chapterText', fromJS(action.text));
		}
		return state
			.set('loadingNewChapterText', false)
			.set('audioSource', action.audioSource)
			.set('formattedSource', action.formattedSource)
			.set('highlights', fromJS(action.highlights))
			.set('chapterText', fromJS(action.text));
	case LOAD_HIGHLIGHTS:
		return state.set('highlights', action.highlights);
	case SET_ACTIVE_NOTES_VIEW:
		return state.set('activeNotesView', action.view);
	case UPDATE_THEME:
		return state.setIn(['userSettings', 'activeTheme'], action.theme);
	case UPDATE_FONT_TYPE:
		return state.setIn(['userSettings', 'activeFontType'], action.font);
	case UPDATE_FONT_SIZE:
		return state.setIn(['userSettings', 'activeFontSize'], action.size);
	case TOGGLE_SETTINGS_OPTION:
		return state.setIn(action.path, !state.getIn(action.path));
	case TOGGLE_SETTINGS_OPTION_AVAILABILITY:
		return state.setIn(action.path, !state.getIn(action.path));
	case UPDATE_SELECTED_TEXT:
		return state.set('selectedText', action.text);
	case SET_SELECTED_BOOK_NAME:
		return state.set('selectedBookName', action.book);
	default:
		return state;
	}
}

export default homePageReducer;
