/*
 *
 * Notes actions
 *
 */

import {
	SET_ACTIVE_CHILD,
	TOGGLE_VERSE_TEXT,
	TOGGLE_ADD_VERSE_MENU,
} from './constants';

export const setActiveChild = (child) => ({
	type: SET_ACTIVE_CHILD,
	child,
});

export const toggleVerseText = () => ({
	type: TOGGLE_VERSE_TEXT,
});

export const toggleAddVerseMenu = () => ({
	type: TOGGLE_ADD_VERSE_MENU,
});
