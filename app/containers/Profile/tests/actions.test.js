import { defaultAction } from '../actions';
import { SELECT_ACCOUNT_OPTION } from '../constants';

describe('Profile actions', () => {
	describe('Default Action', () => {
		it('has a type of SELECT_ACCOUNT_OPTION', () => {
			const expected = {
				type: SELECT_ACCOUNT_OPTION,
			};
			expect(defaultAction()).toEqual(expected);
		});
	});
});
