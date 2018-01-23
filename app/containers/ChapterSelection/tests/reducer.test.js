
import { fromJS } from 'immutable';
import chapterSelectionReducer from '../reducer';

describe('chapterSelectionReducer', () => {
	it('returns the initial state', () => {
		expect(chapterSelectionReducer(undefined, {})).toEqual(fromJS({}));
	});
});
