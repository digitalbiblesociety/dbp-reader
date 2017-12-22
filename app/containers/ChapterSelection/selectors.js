import { createSelector } from 'reselect';

/**
 * Direct selector to the chapterSelection state domain
 */
const selectChapterSelectionDomain = (state) => state.get('chapterSelection');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ChapterSelection
 */

const makeSelectChapterSelection = () => createSelector(
	selectChapterSelectionDomain,
	(substate) => substate.toJS()
);

export default makeSelectChapterSelection;
export {
	selectChapterSelectionDomain,
};
