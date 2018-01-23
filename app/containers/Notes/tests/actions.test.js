
import {
	defaultAction,
} from '../actions';
import {
	SET_ACTIVE_CHILD,
} from '../constants';

describe('Notes actions', () => {
	describe('Default Action', () => {
		it('has a type of SET_ACTIVE_CHILD', () => {
			const expected = {
				type: SET_ACTIVE_CHILD,
			};
			expect(defaultAction()).toEqual(expected);
		});
	});
});
