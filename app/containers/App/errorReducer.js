/*
 *
 * HomePage reducer
 *
 * Use userSettings.toggleOptions.available for determining which
 * options a user has available within their settings.
 */

import { fromJS } from 'immutable';
import {
	ERROR_GETTING_LANGUAGES,
	ERROR_GETTING_VERSIONS,
	CLEAR_ERROR_GETTING_VERSIONS,
	CLEAR_ERROR_GETTING_LANGUAGES,
} from 'containers/TextSelection/constants';
// import esvDefaultFilesets from 'utils/defaultFilesetsForESV.json';

const initialState = fromJS({
	getLanguagesError: false,
	getVersionsError: false,
});

function errorReducer(state = initialState, action) {
	switch (action.type) {
	case ERROR_GETTING_LANGUAGES:
		return state.set('getLanguagesError', true);
	case ERROR_GETTING_VERSIONS:
		return state.set('getVersionsError', true);
	case CLEAR_ERROR_GETTING_VERSIONS:
		return state.set('getVersionsError', false);
	case CLEAR_ERROR_GETTING_LANGUAGES:
		return state.set('getLanguagesError', false);
	default:
		return state;
	}
}

export default errorReducer;
