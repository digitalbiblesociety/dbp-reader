
import {
	defaultAction,
} from '../actions';
import {
	DEFAULT_ACTION,
} from '../constants';

describe('AudioPlayer actions', () => {
	describe('Default Action', () => {
		it('has a type of SELECT_ACCOUNT_OPTION', () => {
			const expected = {
				type: DEFAULT_ACTION,
			};
			expect(defaultAction()).toEqual(expected);
		});
	});
});
