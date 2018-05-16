/*
 *
 * Notes reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SET_ACTIVE_CHILD,
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
	chapterForNote: [],
	listData: [],
	userNotes: [],
	bookmarkList: [],
	chapterBookmarks: [],
	savedTheNote: false,
});

function notesReducer(state = initialState, action) {
	switch (action.type) {
	case READ_SAVED_NOTE:
		return state.set('savedTheNote', false);
	case ADD_NOTE_SUCCESS:
		return state.set('savedTheNote', true);
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
		// console.log('Setting page data', action);
		if (action.params.sectionType === 'notes') {
			return state.set('activePage', action.params.page);
		}
		return state.set('activePageBookmark', action.params.page);
	case SET_PAGE_SIZE:
		// console.log('Setting page size', action);
		if (action.params.sectionType === 'notes') {
			return state
				.set('activePage', 1)
				.set('pageSize', action.params.limit);
		}
		return state
			.set('activePage', 1)
			.set('pageSizeBookmark', action.params.limit);
		// Todo: Move this to local state
	case TOGGLE_VERSE_TEXT:
		return state.set('isVerseTextVisible', !state.get('isVerseTextVisible'));
		// Todo: Move this to local state
	case TOGGLE_PAGE_SELECTOR:
		return state.set('pageSelectorState', !state.get('pageSelectorState'));
	case LOAD_USER_NOTES:
		return state
			.set('userNotes', fromJS(action.listData));
	case LOAD_NOTEBOOK_DATA:
		// console.log('Loading notebook data with active page: ', action.activePage);
		return state
			.set('totalPages', action.totalPages)
			.set('listData', fromJS(action.listData));
	default:
		return state;
	}
}

export default notesReducer;
