/*
 *
 * SearchContainer reducer
 *
 */

import { fromJS } from 'immutable';
import {
	ADD_SEARCH_TERM,
	GET_SEARCH_RESULTS,
	LOAD_SEARCH_RESULTS,
	SEARCH_ERROR,
	STOP_LOADING,
	VIEW_ERROR,
	START_LOADING,
} from './constants';

const initialState = fromJS({
	searchResults: [],
	lastFiveSearches: [],
	trySearchOptions: [
		{ id: 1, searchText: 'Jesus' },
		{ id: 2, searchText: 'love' },
		{ id: 3, searchText: 'prayer' },
	],
	loadingResults: false,
	showError: false,
});

function searchContainerReducer(state = initialState, action) {
	switch (action.type) {
		case ADD_SEARCH_TERM:
			if (
				state.get('lastFiveSearches').includes(action.searchText.toLowerCase())
			) {
				return state.set('loadingResults', true);
			}

			return state.set(
				'lastFiveSearches',
				state.get('lastFiveSearches').size > 9
					? state
							.get('lastFiveSearches')
							.push(action.searchText.toLowerCase())
							.shift()
					: state.get('lastFiveSearches').push(action.searchText.toLowerCase()),
			);
		case GET_SEARCH_RESULTS:
			return state.set('loadingResults', true);
		case LOAD_SEARCH_RESULTS:
			return state
				.set('loadingResults', false)
				.set('showError', false)
				.set('searchResults', fromJS(action.searchResults));
		case SEARCH_ERROR:
			return state.set('showError', true).set('loadingResults', false);
		case VIEW_ERROR:
			return state.set('showError', false);
		case STOP_LOADING:
			return state.set('loadingResults', false);
		case START_LOADING:
			return state.set('loadingResults', true);
		default:
			return state;
	}
}

export default searchContainerReducer;
