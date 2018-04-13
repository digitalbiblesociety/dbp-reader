/*
 *
 * Notes reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SET_ACTIVE_CHILD,
	TOGGLE_VERSE_TEXT,
	TOGGLE_ADD_VERSE_MENU,
	SET_ACTIVE_PAGE_DATA,
	SET_PAGE_SIZE,
	LOAD_USER_NOTES,
	TOGGLE_PAGE_SELECTOR,
	LOAD_CHAPTER_FOR_NOTE,
	// initialNotesListForTesting,
} from './constants';

const initialState = fromJS({
	activeChild: 'notes',
	activePageData: [],
	// activePageData: initialNotesListForTesting.slice(0, 10),
	listData: [],
	// listData: initialNotesListForTesting,
	isAddVerseExpanded: true,
	isVerseTextVisible: false,
	pageSelectorState: false,
	paginationPageSize: 10,
	chapterForNote: [],
});

function notesReducer(state = initialState, action) {
	switch (action.type) {
	case LOAD_CHAPTER_FOR_NOTE:
		return state.set('chapterForNote', action.text);
	case SET_ACTIVE_CHILD:
		return state.set('activeChild', action.child);
	case TOGGLE_VERSE_TEXT:
		return state.set('isVerseTextVisible', !state.get('isVerseTextVisible'));
	case TOGGLE_ADD_VERSE_MENU:
		return state.set('isAddVerseExpanded', !state.get('isAddVerseExpanded'));
	case SET_ACTIVE_PAGE_DATA:
		return state.set('activePageData', action.page);
	case SET_PAGE_SIZE:
		return state.set('paginationPageSize', action.size);
	case TOGGLE_PAGE_SELECTOR:
		return state.set('pageSelectorState', !state.get('pageSelectorState'));
	case LOAD_USER_NOTES:
		return state
			.set('activePageData', action.noteData.notes.slice(0, state.get('paginationPageSize')))
			.set('listData', action.noteData.notes);
	default:
		return state;
	}
}

export default notesReducer;
