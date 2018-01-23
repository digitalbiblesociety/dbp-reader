
import {
	defaultAction,
} from '../actions';
import {
	DEFAULT_ACTION,
} from '../constants';

describe('ChapterSelection actions', () => {
	describe('Default Action', () => {
		it('has a type of SET_ACTIVE_CHILD', () => {
			const expected = {
				type: DEFAULT_ACTION,
			};
			expect(defaultAction()).toEqual(expected);
		});
	});
});
