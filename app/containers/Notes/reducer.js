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
