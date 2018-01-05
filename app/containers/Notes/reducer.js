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
	initialNotesListForTesting,
} from './constants';

const initialState = fromJS({
	activeChild: 'notes',
	note: {
		title: 'Abram Speaks to Sarai',
		verseTitle: 'Genesis 12:13',
		verseText: '"Say you are my sister, that it may go well with me because of you, and that my life may be spared for your sake."',
		text: 'Abram shows a lack of faith in God and a great fear of man with this statement.',
	},
	activePageData: initialNotesListForTesting.slice(0, 10),
	listData: initialNotesListForTesting,
	isAddVerseExpanded: false,
	isVerseTextVisible: false,
});

function notesReducer(state = initialState, action) {
	switch (action.type) {
	case SET_ACTIVE_CHILD:
		return state.set('activeChild', action.child);
	case TOGGLE_VERSE_TEXT:
		return state.set('isVerseTextVisible', !state.get('isVerseTextVisible'));
	case TOGGLE_ADD_VERSE_MENU:
		return state.set('isAddVerseExpanded', !state.get('isAddVerseExpanded'));
	case SET_ACTIVE_PAGE_DATA:
		return state.set('activePageData', action.page);
	default:
		return state;
	}
}

export default notesReducer;
