/*
 *
 * AudioPlayer reducer
 *
 */

import { fromJS } from 'immutable';

const initialState = fromJS({});

function audioPlayerReducer(state = initialState, action) {
	switch (action.type) {
		default:
			return state;
	}
}

export default audioPlayerReducer;
