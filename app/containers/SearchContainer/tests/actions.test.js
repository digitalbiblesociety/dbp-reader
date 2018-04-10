
import {
	defaultAction,
} from '../actions';
import {
	GET_SEARCH_RESULTS,
} from '../constants';

describe('SearchContainer actions', () => {
	describe('Default Action', () => {
		it('has a type of GET_SEARCH_RESULTS', () => {
			const expected = {
				type: GET_SEARCH_RESULTS,
			};
			expect(defaultAction()).toEqual(expected);
		});
	});
});
