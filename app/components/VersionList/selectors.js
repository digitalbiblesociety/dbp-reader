import { createSelector } from 'reselect';

const getErrorsState = (state) => state.get('errors');
const getHomepageState = (state) => state.get('homepage');

const selectActiveBookId = () => createSelector(
	getHomepageState,
	(homepage) => homepage.get('activeBookId')
);

const selectActiveChapter = () => createSelector(
	getHomepageState,
	(homepage) => homepage.get('activeChapter')
);

const getVersionsError = () => createSelector(
	getErrorsState,
	(errors) => errors.get('getVersionsError')
);

export {
	getVersionsError,
	selectActiveBookId,
	selectActiveChapter,
};
