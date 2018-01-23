
import { fromJS } from 'immutable';
import notesReducer from '../reducer';

describe('notesReducer', () => {
	it('returns the initial state', () => {
		expect(notesReducer(undefined, {})).toEqual(fromJS({}));
	});
});
