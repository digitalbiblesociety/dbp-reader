import { createSelector } from 'reselect';

/**
 * Direct selector to the searchContainer state domain
 */
const selectSearchContainerDomain = (state) => state.get('searchContainer');

/**
 * Other specific selectors
 */


/**
 * Default selector used by SearchContainer
 */

const makeSelectSearchContainer = () => createSelector(
	selectSearchContainerDomain,
	(substate) => substate.toJS()
);

export default makeSelectSearchContainer;
export {
	selectSearchContainerDomain,
};
