/*
 *
 * ChapterSelection actions
 *
 */

import {
	SET_SELECTED_BOOK_NAME,
} from './constants';

export const setSelectedBookName = (book) => ({
	type: SET_SELECTED_BOOK_NAME,
	book,
});
