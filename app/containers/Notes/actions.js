/*
 *
 * Notes actions
 *
 */

import {
	SET_ACTIVE_CHILD,
	TOGGLE_VERSE_TEXT,
	TOGGLE_ADD_VERSE_MENU,
	SET_ACTIVE_PAGE_DATA,
	SET_PAGE_SIZE,
	TOGGLE_PAGE_SELECTOR,
	ADD_NOTE,
	ADD_HIGHLIGHT,
	ADD_BOOKMARK,
} from './constants';

export const addNote = ({ data, userId }) => ({
	type: ADD_NOTE,
	data,
	userId,
});

export const addBookmark = ({ data, userId }) => ({
	type: ADD_BOOKMARK,
	data,
	userId,
});

export const addHighlight = ({ data, userId }) => ({
	type: ADD_HIGHLIGHT,
	data,
	userId,
});

export const setActiveChild = (child) => ({
	type: SET_ACTIVE_CHILD,
	child,
});

export const setActivePageData = (page) => ({
	type: SET_ACTIVE_PAGE_DATA,
	page,
});

export const setPageSize = (size) => ({
	type: SET_PAGE_SIZE,
	size,
});

export const toggleVerseText = () => ({
	type: TOGGLE_VERSE_TEXT,
});

export const toggleAddVerseMenu = () => ({
	type: TOGGLE_ADD_VERSE_MENU,
});

export const togglePageSelector = () => ({
	type: TOGGLE_PAGE_SELECTOR,
});
