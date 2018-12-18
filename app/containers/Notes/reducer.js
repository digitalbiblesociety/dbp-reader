/*
 *
 * Notes reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SET_ACTIVE_CHILD,
	LOAD_USER_HIGHLIGHTS,
	TOGGLE_VERSE_TEXT,
	SET_ACTIVE_PAGE_DATA,
	SET_PAGE_SIZE,
	LOAD_USER_NOTES,
	TOGGLE_PAGE_SELECTOR,
	LOAD_CHAPTER_FOR_NOTE,
	LOAD_NOTEBOOK_DATA,
	LOAD_USER_BOOKMARK_DATA,
	ADD_NOTE_SUCCESS,
	LOAD_BOOKMARKS_FOR_CHAPTER,
	READ_SAVED_NOTE,
	ADD_NOTE_FAILED,
	CLEAR_NOTES_ERROR_MESSAGE,
	CLEAN_NOTEBOOK,
} from './constants';
// Should cache some of this in local storage for faster reloads
const initialState = fromJS({
	activeChild: 'notes',
	isVerseTextVisible: true,
	pageSelectorState: false,
	paginationPageSize: 10,
	pageSize: 10,
	activePage: 1,
	totalPages: 1,
	pageSizeBookmark: 10,
	totalPagesBookmark: 1,
	activePageBookmark: 1,
	pageSizeHighlight: 10,
	totalPagesHighlight: 1,
	activePageHighlight: 1,
	chapterForNote: [],
	listData: [],
	userNotes: [],
	userHighlights: [],
	bookmarkList: [],
	chapterBookmarks: [],
	savedTheNote: false,
	errorSavingNote: false,
	notesErrorMessage: '',
});

function notesReducer(state = initialState, action) {
	switch (action.type) {
		case CLEAN_NOTEBOOK:
			return state
				.set('listData', [])
				.set('userNotes', [])
				.set('userHighlights', [])
				.set('bookmarkList', [])
				.set('chapterBookmarks', []);
		case LOAD_USER_HIGHLIGHTS:
			return state
				.set('totalPagesHighlight', action.totalPages)
				.set('userHighlights', fromJS(action.highlights));
		case CLEAR_NOTES_ERROR_MESSAGE:
			return state.set('errorSavingNote', false).set('notesErrorMessage', '');
		case READ_SAVED_NOTE:
			return state.set('savedTheNote', false);
		case ADD_NOTE_SUCCESS:
			return state.set('savedTheNote', true);
		case ADD_NOTE_FAILED:
			return state
				.set('errorSavingNote', true)
				.set('notesErrorMessage', action.message)
				.set('savedTheNote', false);
		case LOAD_BOOKMARKS_FOR_CHAPTER:
			return state.set('chapterBookmarks', fromJS(action.listData));
		case LOAD_USER_BOOKMARK_DATA:
			return state
				.set('totalPagesBookmark', action.totalPages)
				.set('bookmarkList', fromJS(action.listData));
		case LOAD_CHAPTER_FOR_NOTE:
			return state.set('chapterForNote', action.text);
		case SET_ACTIVE_CHILD:
			return state.set('activeChild', action.child);
		case SET_ACTIVE_PAGE_DATA:
			if (action.params.sectionType === 'notes') {
				return state.set('activePage', action.params.page);
			} else if (action.params.sectionType === 'highlights') {
				return state.set('activePageHighlight', action.params.page);
			}
			return state.set('activePageBookmark', action.params.page);
		case SET_PAGE_SIZE:
			if (action.params.sectionType === 'notes') {
				return state.set('activePage', 1).set('pageSize', action.params.limit);
			} else if (action.params.sectionType === 'highlights') {
				return state
					.set('activePageHighlight', 1)
					.set('pageSizeHighlight', action.params.limit);
			}
			return state
				.set('activePage', 1)
				.set('pageSizeBookmark', action.params.limit);
		case TOGGLE_VERSE_TEXT:
			return state.set('isVerseTextVisible', !state.get('isVerseTextVisible'));
		case TOGGLE_PAGE_SELECTOR:
			return state.set('pageSelectorState', !state.get('pageSelectorState'));
		case LOAD_USER_NOTES:
			return state.set('userNotes', fromJS(action.listData));
		case LOAD_NOTEBOOK_DATA:
			return state
				.set('totalPages', action.totalPages)
				.set('listData', fromJS(action.listData));
		default:
			return state;
	}
}

export default notesReducer;
