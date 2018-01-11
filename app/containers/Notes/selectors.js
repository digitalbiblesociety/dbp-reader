import { createSelector } from 'reselect';

/**
 * Direct selector to the notes state domain
 */
const selectNotesDomain = (state) => state.get('notes');

/**
 * Other specific selectors
 */
const selectHighlightedText = () => createSelector(
	(state) => state.get('homepage'),
	(homepage) => homepage.get('selectedText')
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
};
