/*
 *
 * HomePage reducer
 *
 */

import { fromJS } from 'immutable';
import {
	LOAD_TEXTS,
	TOGGLE_BIBLE_NAMES,
	TOGGLE_BOOK_NAMES,
	SET_ACTIVE_BOOK_NAME,
	LOAD_BOOKS,
	LOAD_CHAPTER_TEXT,
	SET_ACTIVE_TEXT,
} from './constants';

const initialState = fromJS({
	texts: [
		{
			abbr: 'ENGESV',
			name: 'English Standard Version',
			vname: 'English Standard Version',
			language: 'English',
			date: 2001,
		},
	],
	books: [],
	chapterText: [],
	isBibleTableActive: false,
	isChapterActive: false,
	activeTextName: 'ENGESV',
	isBookTableActive: false,
	activeBookName: 'GEN',
	activeTextId: 'ENGESV',
});

function homePageReducer(state = initialState, action) {
	switch (action.type) {
	case LOAD_TEXTS:
		return state.set('texts', fromJS(action.texts));
	case TOGGLE_BOOK_NAMES:
		return state
				.set('isBibleTableActive', false)
				.set('isChapterActive', false)
				.set('isBookTableActive', !state.get('isBookTableActive'));
	case TOGGLE_BIBLE_NAMES:
		return state
				.set('isBibleTableActive', !state.get('isBibleTableActive'))
				.set('isChapterActive', false)
				.set('isBookTableActive', false);
	case SET_ACTIVE_TEXT:
		return state
			.set('activeTextName', action.textName)
			.set('activeTextId', action.textId)
			.set('isBookTableActive', true)
			.set('isBibleTableActive', false);
	case SET_ACTIVE_BOOK_NAME:
		return state.set('activeBookName', action.book);
	case LOAD_BOOKS:
		return state.set('books', fromJS(action.books));
	case LOAD_CHAPTER_TEXT:
		return state
			.set('isBookTableActive', false)
			.set('isBibleTableActive', false)
			.set('chapterText', fromJS(action.text))
			.set('isChapterActive', true);
	default:
		return state;
	}
}

export default homePageReducer;
