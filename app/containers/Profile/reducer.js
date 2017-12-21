/*
 *
 * Profile reducer
 *
 */

import { fromJS } from 'immutable';
import {
	SELECT_ACCOUNT_OPTION,
	TOGGLE_SIGN_IN,
} from './constants';

const initialState = fromJS({
	activeOption: 'login',
	signInActive: false,
});

function profileReducer(state = initialState, action) {
	switch (action.type) {
	case SELECT_ACCOUNT_OPTION:
		return state.set('activeOption', action.option);
	case TOGGLE_SIGN_IN:
		return state.set('signInActive', action.state);
	// case SUBMIT_LOGIN:
	// 	return state.set('signInActive', false);
	default:
		return state;
	}
}

export default profileReducer;
