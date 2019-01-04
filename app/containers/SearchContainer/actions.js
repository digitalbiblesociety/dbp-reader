/*
 *
 * SearchContainer actions
 *
 */

import {
	ADD_SEARCH_TERM,
	GET_SEARCH_RESULTS,
	VIEW_ERROR,
	STOP_LOADING,
	START_LOADING,
} from './constants';

export const addSearchTerm = (props) => ({
	type: ADD_SEARCH_TERM,
	...props,
});

export const getSearchResults = (props) => ({
	type: GET_SEARCH_RESULTS,
	...props,
});

export const stopLoading = (props) => ({
	type: STOP_LOADING,
	...props,
});

export const startLoading = (props) => ({
	type: START_LOADING,
	...props,
});

export const viewError = (props) => ({
	type: VIEW_ERROR,
	...props,
});
