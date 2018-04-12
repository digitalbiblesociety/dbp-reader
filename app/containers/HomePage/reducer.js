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
	TOGGLE_AUTOPLAY,
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
	defaultLanguageName: window.navigator.language ? window.navigator.language : 'English',
	activeBookId: 'GEN',
	userSettings: {
		activeTheme: sessionStorage.getItem('bible_is_theme') || 'red',
		activeFontType: sessionStorage.getItem('bible_is_font_family') || 'sans',
		activeFontSize: parseInt(sessionStorage.getItem('bible_is_font_size'), 10) || 42,
		toggleOptions: {
			readersMode: {
				name: 'READER\'S MODE',
				active: JSON.parse(localStorage.getItem('userSettings_toggleOptions_readersMode_active')),
				available: true,
			},
			crossReferences: {
				name: 'CROSS REFERENCE',
				active: JSON.parse(localStorage.getItem('userSettings_toggleOptions_crossReferences_active')),
				available: true,
			},
			redLetter: {
				name: 'RED LETTER',
				active: !!sessionStorage.getItem('bible_is_words_of_jesus'),
				available: true,
			},
			justifiedText: {
				name: 'JUSTIFIED TEXT',
				active: JSON.parse(localStorage.getItem('userSettings_toggleOptions_justifiedText_active')),
				available: true,
			},
			oneVersePerLine: {
				name: 'ONE VERSE PER LINE',
				active: JSON.parse(localStorage.getItem('userSettings_toggleOptions_oneVersePerLine_active')),
				available: true,
			},
			verticalScrolling: {
				name: 'VERTICAL SCROLLING',
				active: false,
				available: false,
			},
		},
	},
	autoPlayEnabled: false,
	loadingBooks: false,
	selectedText: '',
	selectedBookName: 'Genesis',
	audioSource: '',
	invalidBibleId: false,
	hasAudio: false,
	formattedSource: '',
	hasTextInDatabase: true,
	filesetTypes: {},
	firstLoad: true,
	testaments: {},
});

function homePageReducer(state = initialState, action) {
	switch (action.type) {
	case 'book_metadata':
		return state.set('testaments', action.testaments);
	case TOGGLE_FIRST_LOAD_TEXT_SELECTION:
		return state.set('firstLoad', false);
	case TOGGLE_AUTOPLAY:
		return state.set('autoPlayEnabled', !state.get('autoPlayEnabled'));
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
		return state.set('highlights', fromJS(action.highlights));
	case SET_ACTIVE_NOTES_VIEW:
		return state.set('activeNotesView', action.view);
	case UPDATE_THEME:
		return state.setIn(['userSettings', 'activeTheme'], action.theme);
	case UPDATE_FONT_TYPE:
		return state.setIn(['userSettings', 'activeFontType'], action.font);
	case UPDATE_FONT_SIZE:
		return state.setIn(['userSettings', 'activeFontSize'], action.size);
	case TOGGLE_SETTINGS_OPTION:
		if (action.exclusivePath) {
			localStorage.setItem(action.exclusivePath.join('_'), false);
			localStorage.setItem(action.path.join('_'), !state.getIn(action.path));
			return state
				.setIn(action.exclusivePath, false)
				.setIn(action.path, !state.getIn(action.path));
		}
		localStorage.setItem(action.path.join('_'), !state.getIn(action.path));

		return state.setIn(action.path, !state.getIn(action.path));
	case TOGGLE_SETTINGS_OPTION_AVAILABILITY:
		return state.setIn(action.path, !state.getIn(action.path));
	case UPDATE_SELECTED_TEXT:
		return state.set('selectedText', action.text);
	case SET_SELECTED_BOOK_NAME:
		return state.set('selectedBookName', action.book);
	case 'loadbible':
		// console.log('loading bible with', action);
		return state
			.set('activeTextId', fromJS(action.bibleId))
			.set('activeBookId', fromJS(action.activeBookId))
			.set('activeChapter', fromJS(action.activeChapter))
			.set('activeTextName', fromJS(action.name))
			.set('defaultLanguageIso', fromJS(action.iso))
			.set('defaultLanguageName', fromJS(action.languageName))
			.set('activeBookName', fromJS(action.activeBookName))
			.set('invalidBibleId', false)
			// .set('hasFormattedText', fromJS(action.chapterData.hasFormattedText))
			// .set('hasTextInDatabase', fromJS(action.chapterData.hasPlainText))
			// .set('hasAudio', fromJS(action.chapterData.hasAudio))
			// .set('chapterText', fromJS(action.chapterData.plainText))
			.set('books', fromJS(action.books))
			// .set('formattedSource', fromJS(action.chapterData.formattedText))
			.set('activeFilesets', fromJS(action.filesets));
	case 'loadnewchapter':
		// console.log('loading chapter with', action);
		return state
			.set('hasFormattedText', fromJS(action.hasFormattedText))
			.set('hasTextInDatabase', fromJS(action.hasPlainText))
			.set('hasAudio', fromJS(action.hasAudio))
			.set('chapterText', fromJS(action.plainText))
			.set('loadingNewChapterText', false)
			.set('formattedSource', fromJS(action.formattedText));
	case 'loadaudio':
		// console.log('loading audio with', action);
		return state.set('audioSource', action.audioPath);
	case 'getchapter':
		return state.set('loadingNewChapterText', true);
	case 'getbible':
		return state.set('loadingNewChapterText', true);
	case 'loadbibleerror':
		return state
			.set('invalidBibleId', true)
			.set('loadingNewChapterText', false);
	default:
		return state;
	}
}

export default homePageReducer;
