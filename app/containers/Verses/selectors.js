import { createSelector } from 'reselect';

/**
 * Direct selector to the verses state domain
 */
const selectVersesDomain = (state) => state.get('verses');

/**
 * Other specific selectors
 */

/**
 * Default selector used by Verses
 */

const makeSelectVerses = () =>
	createSelector(selectVersesDomain, (substate) => substate.toJS());

export default makeSelectVerses;
export { selectVersesDomain };
