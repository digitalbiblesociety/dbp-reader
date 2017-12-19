
import { fromJS } from 'immutable';
import audioPlayerReducer from '../reducer';

describe('audioPlayerReducer', () => {
	it('returns the initial state', () => {
		expect(audioPlayerReducer(undefined, {})).toEqual(fromJS({}));
	});
});
