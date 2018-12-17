/*
 *
 * Settings reducer
 * TODO: Remove this file and all references to it
 */

import { fromJS } from 'immutable';

const initialState = fromJS({});

function settingsReducer(state = initialState, action) {
	switch (action.type) {
		default:
			return state;
	}
}

export default settingsReducer;
