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
	audioObjects: [
	{
		"book_id": "MAT",
		"book_name": "Matthew",
		"chapter_start": 1,
		"chapter_end": null,
		"verse_start": 1,
		"verse_end": null,
		"timestamp": null,
		"path": "https://dbp-dev.s3.us-west-2.amazonaws.com/audio/CHNUNVN2DA/B01___01_Matthew_____CHNUNVN2DA.mp3?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJOMYRUAEFXAK5KDQ%2F20180109%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20180109T222919Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Signature=3db10c28c2f813db3d779df93631b7534401d5bfcb344c0bd582801c7a697c79"
	},
	{
		"book_id": "MAT",
		"book_name": "Matthew",
		"chapter_start": 2,
		"chapter_end": null,
		"verse_start": 1,
		"verse_end": null,
		"timestamp": null,
		"path": "https://dbp-dev.s3.us-west-2.amazonaws.com/audio/CHNUNVN2DA/B01___02_Matthew_____CHNUNVN2DA.mp3?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJOMYRUAEFXAK5KDQ%2F20180109%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20180109T222919Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Signature=cfd48fd60ae78b2d47877c3b85799b04fe3202334619d09f650ee6dde86a6276"
	},
	{
		"book_id": "MAT",
		"book_name": "Matthew",
		"chapter_start": 3,
		"chapter_end": null,
		"verse_start": 1,
		"verse_end": null,
		"timestamp": null,
		"path": "https://dbp-dev.s3.us-west-2.amazonaws.com/audio/CHNUNVN2DA/B01___03_Matthew_____CHNUNVN2DA.mp3?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJOMYRUAEFXAK5KDQ%2F20180109%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20180109T222919Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Signature=b926c23cd811dd68aa2b4c16eaee3c86393677d9d3c776998e46dd03bd08691c"
	},
	{
		"book_id": "MAT",
		"book_name": "Matthew",
		"chapter_start": 4,
		"chapter_end": null,
		"verse_start": 1,
		"verse_end": null,
		"timestamp": null,
		"path": "https://dbp-dev.s3.us-west-2.amazonaws.com/audio/CHNUNVN2DA/B01___04_Matthew_____CHNUNVN2DA.mp3?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJOMYRUAEFXAK5KDQ%2F20180109%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20180109T222919Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Signature=12c929d73759d3611deb543cb6b8b15e88edbf3f3bef751cbf55831fda4a1911"
	},
	{
		"book_id": "MAT",
		"book_name": "Matthew",
		"chapter_start": 5,
		"chapter_end": null,
		"verse_start": 1,
		"verse_end": null,
		"timestamp": null,
		"path": "https://dbp-dev.s3.us-west-2.amazonaws.com/audio/CHNUNVN2DA/B01___05_Matthew_____CHNUNVN2DA.mp3?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJOMYRUAEFXAK5KDQ%2F20180109%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20180109T222919Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Signature=ac1a3d495430d93057db26c6217f651190df23c7831ee1abf8e5926f28a4bcae"
	},
	{
		"book_id": "MAT",
		"book_name": "Matthew",
		"chapter_start": 6,
		"chapter_end": null,
		"verse_start": 1,
		"verse_end": null,
		"timestamp": null,
		"path": "https://dbp-dev.s3.us-west-2.amazonaws.com/audio/CHNUNVN2DA/B01___06_Matthew_____CHNUNVN2DA.mp3?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJOMYRUAEFXAK5KDQ%2F20180109%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20180109T222919Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Signature=68381a7b339c35fcfbc9d01d68a39c0a98c7fb9e82f6f09fbe8a7a6cf12bcb7c"
	},
	],
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
		return state
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
