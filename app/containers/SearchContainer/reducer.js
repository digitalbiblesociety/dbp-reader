/*
 *
 * SearchContainer reducer
 *
 */

import { fromJS } from 'immutable';
import {
	GET_SEARCH_RESULTS,
	LOAD_SEARCH_RESULTS,
} from './constants';

const initialState = fromJS({
	searchResults: [],
	loadingResults: false,
});

function searchContainerReducer(state = initialState, action) {
	switch (action.type) {
	case GET_SEARCH_RESULTS:
		return state.set('loadingResults', true);
	case LOAD_SEARCH_RESULTS:
		return state
			.set('loadingResults', false)
			.set('searchResults', action.searchResults);
	default:
		return state;
	}
}

export default searchContainerReducer;
