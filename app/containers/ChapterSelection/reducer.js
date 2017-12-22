/*
 *
 * ChapterSelection reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SET_BOOK_LIST_STATE,
	LOAD_BOOKS,
} from './constants';

const initialState = fromJS({
	books: [],
	bookTableActive: false,
});

function chapterSelectionReducer(state = initialState, action) {
	switch (action.type) {
	case SET_BOOK_LIST_STATE:
		return state.set('bookTableActive', action.state);
	case LOAD_BOOKS:
		return state
			.set('books', fromJS(action.books));
	default:
		return state;
	}
}

export default chapterSelectionReducer;
