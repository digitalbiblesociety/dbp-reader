/*
 *
 * SearchContainer actions
 *
 */

import {
	GET_SEARCH_RESULTS,
} from './constants';

export const getSearchResults = (props) => ({
	type: GET_SEARCH_RESULTS,
	...props,
});
