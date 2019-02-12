/*
 *
 * HomePage reducer
 *
 * Use userSettings.toggleOptions.available for determining which
 * options a user has available within their settings.
 */

import { fromJS } from 'immutable';
import { USER_LOGGED_IN, LOG_OUT } from '../Profile/constants';
import {
	CLOSE_VIDEO_PLAYER,
	OPEN_VIDEO_PLAYER,
	SET_HAS_VIDEO,
} from '../VideoPlayer/constants';
import {
	ACTIVE_TEXT_ID,
	CHANGING_VERSION,
	LOAD_AUDIO,
	LOAD_HIGHLIGHTS,
	SET_USER_AGENT,
	SET_ACTIVE_CHAPTER,
	SET_ACTIVE_BOOK_NAME,
	SET_ACTIVE_NOTES_VIEW,
	SET_SELECTED_BOOK_NAME,
	SET_AUDIO_PLAYER_STATE,
	SET_CHAPTER_TEXT_LOADING_STATE,
	TOGGLE_PROFILE,
	TOGGLE_NOTES_MODAL,
	TOGGLE_SEARCH_MODAL,
	TOGGLE_SETTINGS_MODAL,
	TOGGLE_INFORMATION_MODAL,
	TOGGLE_VERSION_SELECTION,
	TOGGLE_CHAPTER_SELECTION,
	TOGGLE_FIRST_LOAD_TEXT_SELECTION,
	SET_ACTIVE_NOTE,
	UPDATE_SELECTED_TEXT,
	GET_BOOKS,
	GET_CHAPTER_TEXT,
	GET_COPYRIGHTS,
	RESET_BOOKMARK_STATE,
	ADD_BOOKMARK_SUCCESS,
	ADD_BOOKMARK_FAILURE,
} from './constants';

const initialState = fromJS({
	books: [],
	chapterText: [],
	audioObjects: [],
	activeFilesets: [],
	highlights: [],
	previousAudioPaths: [],
	nextAudioPaths: [],
	audioPaths: [],
	note: {},
	filesetTypes: {},
	userProfile: {},
	testaments: {},
	copyrights: {
		newTestament: {
			audio: {},
			text: {},
		},
		oldTestament: {
			audio: {},
			text: {},
		},
	},
	activeChapter: 1,
	hasAudio: false,
	hasVideo: false,
	videoPlayerOpen: true,
	userAuthenticated: false,
	isChapterSelectionActive: false,
	isProfileActive: false,
	isSettingsModalActive: false,
	isSearchModalActive: false,
	isNotesModalActive: false,
	isVersionSelectionActive: false,
	isInformationModalActive: false,
	isFromServer: true,
	changingVersion: false,
	invalidBibleId: false,
	hasTextInDatabase: true,
	firstLoad: true,
	audioPlayerState: true,
	chapterTextLoadingState: false,
	loadingNewChapterText: false,
	loadingCopyright: true,
	loadingAudio: false,
	loadingBooks: false,
	userId: '',
	audioType: '',
	match: {
		params: {
			bibleId: 'engesv',
			bookId: 'mat',
			chapter: '1',
			verse: '',
			token: '',
		},
	},
	activeFilesetId: '',
	audioFilesetId: '',
	plainTextFilesetId: '',
	formattedTextFilesetId: '',
	activeBookName: '',
	activeTextName: '',
	activeNotesView: 'notes',
	activeTextId: '',
	defaultLanguageIso: 'eng',
	defaultLanguageCode: 6414,
	defaultLanguageName: 'English',
	activeBookId: '',
	selectedText: '',
	selectedBookName: '',
	audioSource: '',
	formattedSource: '',
	previousAudioFilesetId: '',
	previousAudioSource: '',
	nextAudioFilesetId: '',
	nextAudioSource: '',
	activeVerse: '',
	textDirection: 'ltr',
});

function homePageReducer(state = initialState, action) {
	switch (action.type) {
		// Video player actions
		case OPEN_VIDEO_PLAYER:
			return state.set('videoPlayerOpen', true);
		case CHANGING_VERSION:
			return state.set('changingVersion', action.state);
		case CLOSE_VIDEO_PLAYER:
			return state.set('videoPlayerOpen', false);
		case SET_HAS_VIDEO:
			return state.set('hasVideo', action.state);
		case USER_LOGGED_IN:
			return state.set('userId', action.userId).set('userAuthenticated', true);
		case LOG_OUT:
			localStorage.removeItem('bible_is_user_id');
			localStorage.removeItem('bible_is_user_email');
			localStorage.removeItem('bible_is_user_name');
			localStorage.removeItem('bible_is_user_nickname');
			sessionStorage.removeItem('bible_is_user_id');
			sessionStorage.removeItem('bible_is_user_email');
			sessionStorage.removeItem('bible_is_user_name');
			sessionStorage.removeItem('bible_is_user_nickname');
			return state.set('userId', '').set('userAuthenticated', false);
		case 'book_metadata':
			return state.set('testaments', action.testaments);
		case TOGGLE_FIRST_LOAD_TEXT_SELECTION:
			return state.set('firstLoad', false);

		case GET_CHAPTER_TEXT:
			return state.set('loadingNewChapterText', true);
		case GET_BOOKS:
			return state.set('loadingNewChapterText', true).set('loadingBooks', true);
		case SET_USER_AGENT:
			return state.set('userAgent', 'ms').set('isIe', true);
		case ADD_BOOKMARK_FAILURE:
			return state.set('addBookmarkFailure', true);
		case ADD_BOOKMARK_SUCCESS:
			return state.set('addBookmarkSuccess', true);
		case RESET_BOOKMARK_STATE:
			return state
				.set('addBookmarkFailure', false)
				.set('addBookmarkSuccess', false);
		case LOAD_AUDIO:
			return state.set('audioObjects', fromJS(action.audioObjects));
		case SET_ACTIVE_NOTE:
			return state.set('note', fromJS(action.note));
		case TOGGLE_PROFILE:
			return state.set('isProfileActive', !state.get('isProfileActive'));
		case TOGGLE_CHAPTER_SELECTION:
			return state.set(
				'isChapterSelectionActive',
				!state.get('isChapterSelectionActive'),
			);
		case TOGGLE_SETTINGS_MODAL:
			return state.set(
				'isSettingsModalActive',
				!state.get('isSettingsModalActive'),
			);
		case TOGGLE_SEARCH_MODAL:
			return state.set(
				'isSearchModalActive',
				!state.get('isSearchModalActive'),
			);
		case TOGGLE_NOTES_MODAL:
			return state.set('isNotesModalActive', !state.get('isNotesModalActive'));
		case TOGGLE_VERSION_SELECTION:
			return state.set(
				'isVersionSelectionActive',
				!state.get('isVersionSelectionActive'),
			);
		case TOGGLE_INFORMATION_MODAL:
			return state.set(
				'isInformationModalActive',
				!state.get('isInformationModalActive'),
			);
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
				.setIn(['userSettings', 'autoPlayEnabled'], false)
				.set('activeTextId', action.textId);
		case SET_AUDIO_PLAYER_STATE:
			if (typeof window !== 'undefined') {
				document.cookie = `bible_is_audio_open=${action.state};path=/`;
			}
			return state.set('audioPlayerState', action.state);
		case LOAD_HIGHLIGHTS:
			return state.set('highlights', fromJS(action.highlights));
		case SET_ACTIVE_NOTES_VIEW:
			return state.set('activeNotesView', action.view);
		case UPDATE_SELECTED_TEXT:
			return state.set('selectedText', action.text);
		case SET_SELECTED_BOOK_NAME:
			return state.set('selectedBookName', action.book);
		case 'loadbible':
			return state
				.set('activeTextId', fromJS(action.bibleId))
				.set('activeBookId', fromJS(action.activeBookId))
				.set('activeChapter', fromJS(action.activeChapter))
				.set('activeTextName', fromJS(action.name))
				.set('defaultLanguageIso', fromJS(action.iso))
				.set('defaultLanguageName', fromJS(action.languageName))
				.set('defaultLanguageCode', fromJS(action.languageCode))
				.set('activeBookName', fromJS(action.activeBookName))
				.set('invalidBibleId', false)
				.set('audioPlayerState', action.chapterData.hasAudio)
				.set('activeVerse', action.chapterData.verse)
				.set('textDirection', action.textDirection)
				.set('books', fromJS(action.books))
				.set('activeFilesets', fromJS(action.filesets));
		case 'loadnewchapter':
			return state
				.set('hasFormattedText', fromJS(action.hasFormattedText))
				.set('hasTextInDatabase', fromJS(action.hasPlainText))
				.set('hasAudio', fromJS(action.hasAudio))
				.set('chapterText', fromJS(action.plainText))
				.set('loadingNewChapterText', false)
				.setIn(
					['userSettings', 'toggleOptions', 'crossReferences', 'available'],
					action.hasFormattedText &&
						(action.formattedText.includes('class="ft"') ||
							action.formattedText.includes('class="xt"')),
				)
				.setIn(
					['userSettings', 'toggleOptions', 'redLetter', 'available'],
					action.hasFormattedText &&
						(action.formattedText.includes('class="wj"') ||
							action.formattedText.includes("class='wj'")),
				)
				.setIn(
					['userSettings', 'toggleOptions', 'readersMode', 'available'],
					action.hasPlainText,
				)
				.setIn(
					['userSettings', 'toggleOptions', 'oneVersePerLine', 'available'],
					action.hasPlainText,
				)
				.set('formattedTextFilesetId', action.formattedTextFilesetId)
				.set('plainTextFilesetId', action.plainTextFilesetId)
				.set('activeVerse', action.verse)
				.set('formattedSource', fromJS(action.formattedText));
		case 'loadaudio':
			return state
				.set('hasAudio', true)
				.set('audioPaths', action.audioPaths.slice(1))
				.set('audioFilesetId', action.audioFilesetId)
				.set('loadingAudio', false)
				.set('audioSource', action.audioPaths[0] || '');
		case 'getchapter':
			return state.set('loadingAudio', true).set('loadingNewChapterText', true);
		case 'loadbibleerror':
			return state
				.set('invalidBibleId', true)
				.set('loadingCopyright', false)
				.set('loadingAudio', false)
				.set('loadingNewChapterText', false);
		case GET_COPYRIGHTS:
			return state.set('loadingCopyright', true);
		case 'loadcopyright':
			return state
				.set('loadingCopyright', false)
				.set('copyrights', action.copyrights);
		case 'GET_INITIAL_ROUTE_STATE_HOMEPAGE':
			return state.merge(action.homepage);
		case SET_CHAPTER_TEXT_LOADING_STATE:
			return state.set('chapterTextLoadingState', action.state);
		default:
			return state;
	}
}

export default homePageReducer;
