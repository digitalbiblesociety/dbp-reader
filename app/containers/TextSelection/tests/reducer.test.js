
import { fromJS } from 'immutable';
import textSelectionReducer from '../reducer';

describe('textSelectionReducer', () => {
	it('returns the initial state', () => {
		expect(textSelectionReducer(undefined, {})).toEqual(fromJS({}));
	});
});
