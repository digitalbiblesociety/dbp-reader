/*
 *
 * SearchContainer actions
 *
 */

import {
	GET_SEARCH_RESULTS,
	VIEW_ERROR,
	STOP_LOADING,
} from './constants';

export const getSearchResults = (props) => ({
	type: GET_SEARCH_RESULTS,
	...props,
});

export const stopLoading = (props) => ({
	type: STOP_LOADING,
	...props,
});

export const viewError = (props) => ({
	type: VIEW_ERROR,
	...props,
});
