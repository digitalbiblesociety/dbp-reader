import { createSelector } from 'reselect';

const selectHomepageDomain = (state) => state.get('homepage');

// TODO: Refactor from using toJS() to using immutable maps
const selectBooks = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('books').toJS()
);

const selectActiveTextId = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeTextId')
);

const selectActiveBookName = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeBookName')
);

const selectActiveChapter = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeChapter')
);

const selectAudioObjects = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('audioObjects')
);

const selectHasPlainText = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('hasPlainText')
);

export {
	selectActiveTextId,
	selectBooks,
	selectActiveBookName,
	selectActiveChapter,
	selectAudioObjects,
	selectHasPlainText,
};
