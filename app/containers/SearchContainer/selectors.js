import { createSelector } from 'reselect';
import { fromJS } from 'immutable';

/**
 * Direct selector to the searchContainer state domain
 */
const selectSearchContainerDomain = (state) => state.get('searchContainer');

/**
 * Other specific selectors
 */
const selectSearchResults = () =>
	createSelector(selectSearchContainerDomain, (search) => {
		const results = search.get('searchResults');
		return results.reduce((acc, cur) => {
			// each different book_id needs to have an array of its results
			const cbook = cur.get('book_id');
			if (acc.get(cbook)) {
				return acc.setIn(
					[cbook, 'results'],
					acc.getIn([cbook, 'results']).push(cur),
				);
			}
			return acc
				.setIn([cbook, 'results'], fromJS([cur]))
				.setIn([cbook, 'name'], cur.get('book_name_alt'));
		}, fromJS({}));
	});

/**
 * Default selector used by SearchContainer
 */

const makeSelectSearchContainer = () =>
	createSelector(selectSearchContainerDomain, (substate) => substate.toJS());

export default makeSelectSearchContainer;
export { selectSearchContainerDomain, selectSearchResults };
