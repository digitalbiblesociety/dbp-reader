/*
 *
 * Notes reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SET_ACTIVE_CHILD,
} from './constants';

const initialState = fromJS({
	activeChild: 'notes',
	listData: [{ date: '01.15.18', text: 'This is an example note', title: 'Psalm 23:3' }],
});

function notesReducer(state = initialState, action) {
	switch (action.type) {
	case SET_ACTIVE_CHILD:
		return state.set('activeChild', action.child);
	default:
		return state;
	}
}

export default notesReducer;
