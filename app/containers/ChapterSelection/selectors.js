import { createSelector } from 'reselect';

/**
 * Other specific selectors
 */
const selectHomepageDomain = (state) => state.get('homepage');

const selectActiveBookName = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeBookName')
);

const selectActiveChapter = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeChapter')
);

export {
	selectActiveChapter,
	selectActiveBookName,
};
