/*
 *
 * SearchContainer reducer
 *
 */

import { fromJS } from 'immutable';
import {
	GET_SEARCH_RESULTS,
	LOAD_SEARCH_RESULTS,
	SEARCH_ERROR,
	STOP_LOADING,
	VIEW_ERROR,
	START_LOADING,
} from './constants';

const initialState = fromJS({
	searchResults: [],
	lastFiveSearches: JSON.parse(localStorage.getItem('bible_is_last_searches')) || [],
	trySearchOptions: [
		{ id: 1, searchText: 'Jesus' },
		{ id: 2, searchText: 'Romans 10:17' },
		{ id: 3, searchText: 'self control' },
	],
	loadingResults: false,
	showError: false,
});

function searchContainerReducer(state = initialState, action) {
	switch (action.type) {
	case GET_SEARCH_RESULTS:
		if (state.get('lastFiveSearches').includes(action.searchText.toLowerCase())) {
			return state
				// .set('lastFiveSearches', state.get('lastFiveSearches'))
				.set('loadingResults', true);
		}
		localStorage.setItem('bible_is_last_searches', state.get('lastFiveSearches').size > 4 ? JSON.stringify(state.get('lastFiveSearches').push(action.searchText.toLowerCase()).shift()) : JSON.stringify(state.get('lastFiveSearches').push(action.searchText.toLowerCase())));
		return state
			.set('lastFiveSearches', state.get('lastFiveSearches').size > 4 ? state.get('lastFiveSearches').push(action.searchText.toLowerCase()).shift() : state.get('lastFiveSearches').push(action.searchText.toLowerCase()))
			.set('loadingResults', true);
		// const last = state.get('lastFiveSearches');
		// const newLast = state.get('lastFiveSearches').includes(action.searchText) ?  : state.get('lastFiveSearches').push(action.searchText);
		//
		// return state
		// 	.set('lastFiveSearches', newLast.size > 5 ? newLast.shift() : newLast)
		// 	.set('loadingResults', true);
	case LOAD_SEARCH_RESULTS:
		return state
			.set('loadingResults', false)
			.set('searchResults', action.searchResults);
	case SEARCH_ERROR:
		return state
			.set('showError', true)
			.set('loadingResults', false);
	case VIEW_ERROR:
		return state
			.set('showError', false);
	case STOP_LOADING:
		return state
			.set('loadingResults', false);
	case START_LOADING:
		return state
			.set('loadingResults', true);
	default:
		return state;
	}
}

export default searchContainerReducer;
