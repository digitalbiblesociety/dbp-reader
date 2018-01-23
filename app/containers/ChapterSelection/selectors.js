import { createSelector } from 'reselect';

/**
 * Direct selector to the chapterSelection state domain
 */
const selectChapterSelectionDomain = (state) => state.get('chapterSelection');

/**
 * Other specific selectors
 */
const selectHomepageDomain = (state) => state.get('homepage');

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
	selectActiveChapter,
	selectActiveTextId,
	selectActiveBookName,
	selectBooks,
	selectActiveFilesets,
};
