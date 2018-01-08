/*
 *
 * Notes constants
 *
 */
import range from 'lodash/range';

export const SET_ACTIVE_CHILD = 'app/Notes/SET_ACTIVE_CHILD';
export const TOGGLE_ADD_VERSE_MENU = 'app/Notes/TOGGLE_ADD_VERSE_MENU';
export const TOGGLE_VERSE_TEXT = 'app/Notes/TOGGLE_VERSE_TEXT';
export const SET_ACTIVE_PAGE_DATA = 'app/Notes/SET_ACTIVE_PAGE_DATA';
export const SET_PAGE_SIZE = 'app/Notes/SET_PAGE_SIZE';
export const T0GGLE_PAGE_SELECTOR = 'app/Notes/T0GGLE_PAGE_SELECTOR';
export const initialNotesListForTesting = range(1, 103).map((note) => ({
	title: 'Abram Speaks to Sarai',
	date: `1.${note}.18`,
	text: 'Abram shows a lack of faith in God and a great fear of man with this statement.',
}));
