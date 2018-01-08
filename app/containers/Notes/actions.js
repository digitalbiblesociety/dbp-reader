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
	T0GGLE_PAGE_SELECTOR,
} from './constants';

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
	type: T0GGLE_PAGE_SELECTOR,
});
