/*
 *
 * HomePage reducer
 *
 * Use userSettings.toggleOptions.available for determining which
 * options a user has available within their settings.
 */

import { fromJS } from 'immutable';
// import esvDefaultFilesets from 'utils/defaultFilesetsForESV.json';
import { USER_LOGGED_IN, LOG_OUT } from '../Profile/constants';
import {
	CLOSE_VIDEO_PLAYER,
	OPEN_VIDEO_PLAYER,
} from '../VideoPlayer/constants';
import {
	ACTIVE_TEXT_ID,
	// CHANGE_VERSE,
	LOAD_AUDIO,
	LOAD_BOOKS,
	LOAD_HIGHLIGHTS,
	SET_USER_AGENT,
	SET_ACTIVE_CHAPTER,
	SET_ACTIVE_BOOK_NAME,
	SET_ACTIVE_NOTES_VIEW,
	SET_SELECTED_BOOK_NAME,
	SET_AUDIO_PLAYER_STATE,
	SET_CHAPTER_TEXT_LOADING_STATE,
	TOGGLE_PROFILE,
	TOGGLE_AUTOPLAY,
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
	userSettings: {
		// 	activeTheme: sessionStorage.getItem('bible_is_theme') || 'red',
		// 	activeFontType: sessionStorage.getItem('bible_is_font_family') || 'sans',
		// 	activeFontSize:
		// 		parseInt(sessionStorage.getItem('bible_is_font_size'), 10) || 42,
		// 	toggleOptions: {
		// 		readersMode: {
		// 			name: "READER'S MODE",
		// 			active: JSON.parse(
		// 				localStorage.getItem('userSettings_toggleOptions_readersMode_active'),
		// 			),
		// 			available: true,
		// 		},
		// 		crossReferences: {
		// 			name: 'CROSS REFERENCE',
		// 			active: localStorage.getItem(
		// 				'userSettings_toggleOptions_crossReferences_active',
		// 			)
		// 				? JSON.parse(
		// 						localStorage.getItem(
		// 							'userSettings_toggleOptions_crossReferences_active',
		// 						),
		// 				  )
		// 				: true,
		// 			available: true,
		// 		},
		// 		redLetter: {
		// 			name: 'RED LETTER',
		// 			active: localStorage.getItem('bible_is_words_of_jesus')
		// 				? JSON.parse(localStorage.getItem('bible_is_words_of_jesus'))
		// 				: true,
		// 			available: true,
		// 		},
		// 		justifiedText: {
		// 			name: 'JUSTIFIED TEXT',
		// 			active: JSON.parse(
		// 				localStorage.getItem(
		// 					'userSettings_toggleOptions_justifiedText_active',
		// 				),
		// 			),
		// 			available: true,
		// 		},
		// 		oneVersePerLine: {
		// 			name: 'ONE VERSE PER LINE',
		// 			active: JSON.parse(
		// 				localStorage.getItem(
		// 					'userSettings_toggleOptions_oneVersePerLine_active',
		// 				),
		// 			),
		// 			available: true,
		// 		},
		// 		verticalScrolling: {
		// 			name: 'VERTICAL SCROLLING',
		// 			active: false,
		// 			available: false,
		// 		},
		// 	},
		// },
		// autoPlayEnabled: sessionStorage.getItem('bible_is_autoplay')
		// 	? JSON.parse(sessionStorage.getItem('bible_is_autoplay'))
		// 	: false,
		activeTheme: 'red',
		activeFontType: 'sans',
		activeFontSize: 42,
		toggleOptions: {
			readersMode: {
				name: "READER'S MODE",
				active: false,
				available: true,
			},
			crossReferences: {
				name: 'CROSS REFERENCE',
				active: true,
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
				available: false,
			},
		},
	},
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
	chapterTextLoadingState: false,
	videoPlayerOpen: false,
	userAuthenticated:
		// !!localStorage.getItem('bible_is_user_id') ||
		// !!sessionStorage.getItem('bible_is_user_id') ||
		false,
	isChapterSelectionActive: false,
	isProfileActive: false,
	isSettingsModalActive: false,
	isSearchModalActive: false,
	isNotesModalActive: false,
	isVersionSelectionActive: false,
	isInformationModalActive: false,
	autoPlayEnabled: false,
	loadingBooks: false,
	isFromServer: true,
	invalidBibleId: false,
	hasAudio: false,
	hasTextInDatabase: true,
	firstLoad: true,
	audioPlayerState: true,
	loadingNewChapterText: false,
	loadingCopyright: true,
	loadingAudio: false,
	userId:
		// localStorage.getItem('bible_is_user_id') ||
		// sessionStorage.getItem('bible_is_user_id') ||
		'',
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
		case OPEN_VIDEO_PLAYER:
			return state.set('videoPlayerOpen', true);
		case CLOSE_VIDEO_PLAYER:
			return state.set('videoPlayerOpen', false);
		case USER_LOGGED_IN:
			return state.set('userId', action.userId).set('userAuthenticated', true);
		case LOG_OUT:
			// console.log('In the logout for homepage');
			return state.set('userId', '').set('userAuthenticated', false);
		case 'book_metadata':
			return state.set('testaments', action.testaments);
		case TOGGLE_FIRST_LOAD_TEXT_SELECTION:
			return state.set('firstLoad', false);
		case TOGGLE_AUTOPLAY:
			if (typeof window !== 'undefined') {
				sessionStorage.setItem(
					'bible_is_autoplay',
					!state.getIn(['userSettings', 'autoPlayEnabled']),
				);
			}
			return state.setIn(
				['userSettings', 'autoPlayEnabled'],
				!state.getIn(['userSettings', 'autoPlayEnabled']),
			);
		case GET_CHAPTER_TEXT:
			return state.set('loadingNewChapterText', true);
		case GET_BOOKS:
			return state.set('loadingNewChapterText', true).set('loadingBooks', true);
		case SET_USER_AGENT:
			return state.set('userAgent', 'ms');
		case ADD_BOOKMARK_FAILURE:
			return state.set('addBookmarkFailure', true);
		case ADD_BOOKMARK_SUCCESS:
			return state.set('addBookmarkSuccess', true);
		case RESET_BOOKMARK_STATE:
			return state
				.set('addBookmarkFailure', false)
				.set('addBookmarkSuccess', false);
		case LOAD_BOOKS:
			// Setting the active book name based on whether a name was introduced via
			// the bookId in the url, this was the best I could come up with
			return state
				.set('loadingBooks', false)
				.set('hasTextInDatabase', action.hasTextInDatabase)
				.set('filesetTypes', fromJS(action.filesetTypes))
				.set('copywrite', fromJS(action.copywrite))
				.set(
					'activeBookName',
					action.activeBookName || state.get('activeBookName'),
				)
				.set('books', fromJS(action.books));
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
				.set('activeTextId', action.textId);
		case SET_AUDIO_PLAYER_STATE:
			if (typeof window !== 'undefined') {
				sessionStorage.setItem('bible_is_audio_player_state', action.state);
			}
			return state.set('audioPlayerState', action.state);
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
			if (typeof window !== 'undefined') {
				// console.log('Setting text setting', action.exclusivePath.join('_'), !state.getIn(action.path));
				// Exclusive path is the path to the setting that cannot be active at the same time as this one
				if (action.exclusivePath) {
					localStorage.setItem(action.exclusivePath.join('_'), false);
					localStorage.setItem(
						action.path.join('_'),
						!state.getIn(action.path),
					);
					return state
						.setIn(action.exclusivePath, false)
						.setIn(action.path, !state.getIn(action.path));
				}
				localStorage.setItem(action.path.join('_'), !state.getIn(action.path));

				return state.setIn(action.path, !state.getIn(action.path));
			}
			if (action.exclusivePath) {
				return state
					.setIn(action.exclusivePath, false)
					.setIn(action.path, !state.getIn(action.path));
			}
			return state.setIn(action.path, !state.getIn(action.path));
		case TOGGLE_SETTINGS_OPTION_AVAILABILITY:
			return state.setIn(action.path, !state.getIn(action.path));
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
			// console.log('loading audio with', action);
			return (
				state
					.set('audioPaths', action.audioPaths.slice(1))
					// .set('loadingNewChapterText', false)
					.set('audioFilesetId', action.audioFilesetId)
					.set('loadingAudio', false)
					.set('audioSource', action.audioPaths[0] || '')
			);
		case 'getchapter':
			return state.set('loadingAudio', true).set('loadingNewChapterText', true);
		// case 'getbible':
		// 	return state.map((data, key) => newBibleState.get(key) || data);
		case 'loadbibleerror':
			return state
				.set('invalidBibleId', true)
				.set('loadingCopyright', false)
				.set('loadingAudio', false)
				.set('loadingNewChapterText', false);
		case GET_COPYRIGHTS:
			return state.set('loadingCopyright', true);
		case 'loadcopyright':
			// console.log('Loading copyrights, this is a test to see if all of these cases are being run or if something is happening out of order');
			return state
				.set('loadingCopyright', false)
				.set('copyrights', action.copyrights);
		case 'GET_INITIAL_ROUTE_STATE_HOMEPAGE':
			// console.log('action.homepage', action.homepage);
			return state.merge(action.homepage);
		case SET_CHAPTER_TEXT_LOADING_STATE:
			return state.set('chapterTextLoadingState', action.state);
		default:
			return state;
	}
}

export default homePageReducer;
