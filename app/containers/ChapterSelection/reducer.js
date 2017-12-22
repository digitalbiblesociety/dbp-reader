/*
 *
 * ChapterSelection reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SET_SELECTED_BOOK_NAME,
	LOAD_BOOKS,
} from './constants';

const initialState = fromJS({
	books: [],
	selectedBookName: 'Genesis',
});

function chapterSelectionReducer(state = initialState, action) {
	switch (action.type) {
	case SET_SELECTED_BOOK_NAME:
		return state.set('selectedBookName', action.book);
	case LOAD_BOOKS:
		return state
			.set('books', fromJS(action.books));
	default:
		return state;
	}
}

export default chapterSelectionReducer;
