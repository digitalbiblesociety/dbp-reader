/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux-immutable';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

import languageProviderReducer from './containers/LanguageProvider/reducer';
import profileReducer from './containers/Profile/reducer';
// import textSelectionReducer from './containers/TextSelection/reducer';
import homepageReducer from './containers/HomePage/reducer';
import videoPlayerReducer from './containers/VideoPlayer/reducer';
import settingsReducer from './containers/Settings/reducer';
import searchContainerReducer from './containers/SearchContainer/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */

// Initial routing state
const routeInitialState = fromJS({
	location: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
	switch (action.type) {
		/* istanbul ignore next */
		case LOCATION_CHANGE:
			return state.merge({
				location: action.payload,
			});
		default:
			return state;
	}
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
	return combineReducers({
		route: routeReducer,
		profile: profileReducer,
		language: languageProviderReducer,
		homepage: homepageReducer,
		videoPlayer: videoPlayerReducer,
		settings: settingsReducer,
		searchContainer: searchContainerReducer,
		...injectedReducers,
	});
}
