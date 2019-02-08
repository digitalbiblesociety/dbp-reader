import { createSelector } from 'reselect';
import { selectHomePageDomain } from '../HomePage/selectors';
/**
 * Direct selector to the verses state domain
 */
const selectVersesDomain = (state) => state.get('verses');
const selectSettingsDomain = (state) => state.get('settings');
const selectProfilePageDomain = (state) => state.get('profile');

/**
 * Other specific selectors
 * TODO: The calls below are perfect for testing a partially applied function creator
 */
// Homepage State
const selectHighlights = () =>
	createSelector(selectHomePageDomain, (home) => home.get('highlights').toJS());
const selectActiveTextId = () =>
	createSelector(selectHomePageDomain, (home) => home.get('activeTextId'));
const selectActiveBookId = () =>
	createSelector(selectHomePageDomain, (home) => home.get('activeBookId'));
const selectActiveBookName = () =>
	createSelector(selectHomePageDomain, (home) => home.get('activeBookName'));
const selectActiveChapter = () =>
	createSelector(selectHomePageDomain, (home) => home.get('activeChapter'));
const selectVerseNumber = () =>
	createSelector(selectHomePageDomain, (home) => home.get('verseNumber'));
const selectNotesMenuState = () =>
	createSelector(selectHomePageDomain, (home) =>
		home.get('isNotesModalActive'),
	);
const selectTextDirection = () =>
	createSelector(selectHomePageDomain, (home) => home.get('textDirection'));
// Settings State
const selectUserSettings = () =>
	createSelector(selectSettingsDomain, (settings) =>
		settings.get('userSettings'),
	);
// Profile State
const selectUserId = () =>
	createSelector(selectProfilePageDomain, (profile) => profile.get('userId'));
const selectUserAuthenticated = () =>
	createSelector(selectProfilePageDomain, (profile) =>
		profile.get('userAuthenticated'),
	);
/**
 * Default selector used by Verses
 */

const makeSelectVerses = () =>
	createSelector(selectVersesDomain, (substate) => substate.toJS());

export default makeSelectVerses;
export {
	selectVersesDomain,
	// Homepage
	selectHighlights,
	selectActiveTextId,
	selectActiveBookId,
	selectActiveBookName,
	selectActiveChapter,
	selectVerseNumber,
	selectNotesMenuState,
	selectTextDirection,
	// Settings
	selectUserSettings,
	// Profile
	selectUserId,
	selectUserAuthenticated,
};
