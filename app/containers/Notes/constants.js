/*
 *
 * Notes constants
 *
 */
// import range from 'lodash/range';

export const SET_PAGE_SIZE = 'app/Notes/SET_PAGE_SIZE';
export const SET_ACTIVE_CHILD = 'app/Notes/SET_ACTIVE_CHILD';
export const SET_ACTIVE_PAGE_DATA = 'app/Notes/SET_ACTIVE_PAGE_DATA';
export const TOGGLE_ADD_VERSE_MENU = 'app/Notes/TOGGLE_ADD_VERSE_MENU';
export const TOGGLE_VERSE_TEXT = 'app/Notes/TOGGLE_VERSE_TEXT';
export const TOGGLE_PAGE_SELECTOR = 'app/Notes/TOGGLE_PAGE_SELECTOR';
export const GET_USER_NOTES = 'app/Notes/GET_USER_NOTES';
export const GET_CHAPTER_FOR_NOTE = 'app/Notes/GET_CHAPTER_FOR_NOTE';
export const LOAD_CHAPTER_FOR_NOTE = 'app/Notes/LOAD_CHAPTER_FOR_NOTE';
export const LOAD_USER_NOTES = 'app/Notes/LOAD_USER_NOTES';
export const ADD_NOTE = 'app/Profile/ADD_NOTE';
export const ADD_NOTE_SUCCESS = 'app/Notes/ADD_NOTE_SUCCESS';
export const ADD_HIGHLIGHT = 'app/Profile/ADD_HIGHLIGHT';
export const ADD_BOOKMARK = 'app/Profile/ADD_BOOKMARK';
export const UPDATE_NOTE = 'app/Profile/UPDATE_NOTE';
export const DELETE_NOTE = 'app/Profile/DELETE_NOTE';

// Note generator for testing
// export const initialNotesListForTesting = range(1, 103).map((note) => ({
// 	title: 'Abram Speaks to Sarai',
// 	created_at: `1.${note}.18`,
// 	notes: 'Abram shows a lack of faith in God and a great fear of man with this statement.',
// 	referenceId: 'GEN_12_13',
// }));
