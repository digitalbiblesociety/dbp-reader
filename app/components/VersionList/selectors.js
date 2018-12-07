import { createSelector } from 'reselect';

const getHomepageState = (state) => state.get('homepage');

const selectActiveBookId = () =>
	createSelector(getHomepageState, (homepage) => homepage.get('activeBookId'));

const selectActiveChapter = () =>
	createSelector(getHomepageState, (homepage) => homepage.get('activeChapter'));

export { selectActiveBookId, selectActiveChapter };
