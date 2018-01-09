
import { fromJS } from 'immutable';
import searchContainerReducer from '../reducer';

describe('searchContainerReducer', () => {
	it('returns the initial state', () => {
		expect(searchContainerReducer(undefined, {})).toEqual(fromJS({}));
	});
});
