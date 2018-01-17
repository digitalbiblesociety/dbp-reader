import { createSelector } from 'reselect';

/**
 * Direct selector to the notes state domain
 */
const selectNotesDomain = (state) => state.get('notes');

/**
 * Other specific selectors
 */
const selectHomepageDomain = (state) => state.get('homepage');

const selectHighlightedText = () => createSelector(
	(state) => state.get('homepage'),
	(homepage) => homepage.get('selectedText')
);

const selectBooks = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('books').toJS()
);

const selectActiveBookName = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeBookName')
);

const selectActiveChapter = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeChapter')
);

const selectActiveTextId = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeTextId')
);

const selectActiveFilesets = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeFilesets')
);

const selectSelectedBookName = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('selectedBookName')
);

/**
 * Default selector used by Notes
 */

const makeSelectNotes = () => createSelector(
	selectNotesDomain,
	(substate) => substate.toJS()
);

export default makeSelectNotes;
export {
	selectNotesDomain,
	selectHighlightedText,
	selectActiveChapter,
	selectActiveTextId,
	selectActiveBookName,
	selectBooks,
	selectActiveFilesets,
	selectSelectedBookName,
};
