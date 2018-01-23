/*
 *
 * ChapterSelection reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SET_SELECTED_BOOK_NAME,
} from './constants';

const initialState = fromJS({
	selectedBookName: 'Genesis',
});

function chapterSelectionReducer(state = initialState, action) {
	switch (action.type) {
	case SET_SELECTED_BOOK_NAME:
		return state.set('selectedBookName', action.book);
	default:
		return state;
	}
}

export default chapterSelectionReducer;
