/*
 *
 * Settings reducer
 *
 */

import { fromJS } from 'immutable';
import {
	TOGGLE_SETTINGS_OPTION,
	TOGGLE_SETTINGS_OPTION_AVAILABILITY,
	UPDATE_THEME,
	UPDATE_FONT_TYPE,
	UPDATE_FONT_SIZE,
	TOGGLE_AUTOPLAY,
} from './constants';
import { ACTIVE_TEXT_ID } from '../HomePage/constants';
import { SET_VOLUME, SET_PLAYBACK_RATE } from '../AudioPlayer/constants';

const initialState = fromJS({
	userSettings: {
		activeTheme: 'red',
		activeFontType: 'sans',
		activeFontSize: 42,
		toggleOptions: {
			readersMode: {
				name: "READER'S MODE",
				active: false,
				available: true,
			},
			crossReferences: {
				name: 'CROSS REFERENCE',
				active: true,
				available: true,
			},
			redLetter: {
				name: 'RED LETTER',
				active: true,
				available: true,
			},
			justifiedText: {
				name: 'JUSTIFIED TEXT',
				active: true,
				available: true,
			},
			oneVersePerLine: {
				name: 'ONE VERSE PER LINE',
				active: false,
				available: true,
			},
			verticalScrolling: {
				name: 'VERTICAL SCROLLING',
				active: false,
				available: false,
			},
		},
		// Audio related
		autoPlayEnabled: true,
		volume: 1,
		playbackRate: 1,
	},
});

function settingsReducer(state = initialState, action) {
	switch (action.type) {
		case SET_VOLUME:
			return state.setIn(['userSettings', 'volume'], action.value);
		case SET_PLAYBACK_RATE:
			return state.setIn(['userSettings', 'playbackRate'], action.value);
		case ACTIVE_TEXT_ID:
			// May need this if settings should change based on active version
			return state;
		case UPDATE_THEME:
			return state.setIn(['userSettings', 'activeTheme'], action.theme);
		case UPDATE_FONT_TYPE:
			return state.setIn(['userSettings', 'activeFontType'], action.font);
		case UPDATE_FONT_SIZE:
			return state.setIn(['userSettings', 'activeFontSize'], action.size);
		case TOGGLE_AUTOPLAY:
			if (typeof window !== 'undefined') {
				document.cookie = `bible_is_autoplay=${action.state};path=/`;
			}
			return state.setIn(['userSettings', 'autoPlayEnabled'], action.state);
		case TOGGLE_SETTINGS_OPTION:
			if (typeof window !== 'undefined') {
				// Exclusive path is the path to the setting that cannot be active at the same time as this one
				// action.exclusivePath is the path of the option that cannot have the same state as the one currently being set
				if (action.exclusivePath) {
					document.cookie = `bible_is_${action.exclusivePath.join(
						'_',
					)}=false;path=/`;
					document.cookie = `bible_is_${action.path.join('_')}=${!state.getIn(
						action.path,
					)};path=/`;

					return state
						.setIn(action.exclusivePath, false)
						.setIn(action.path, !state.getIn(action.path));
				}

				document.cookie = `bible_is_${action.path.join('_')}=${!state.getIn(
					action.path,
				)};path=/`;

				return state.setIn(action.path, !state.getIn(action.path));
			}
			if (action.exclusivePath) {
				return state
					.setIn(action.exclusivePath, false)
					.setIn(action.path, !state.getIn(action.path));
			}
			return state.setIn(action.path, !state.getIn(action.path));
		case TOGGLE_SETTINGS_OPTION_AVAILABILITY:
			return state.setIn(action.path, !state.getIn(action.path));
		// case 'GET_INITIAL_ROUTE_STATE_HOMEPAGE':
		// 	return state.merge(action.homepage);
		case 'GET_INITIAL_ROUTE_STATE_SETTINGS':
			return state
				.setIn(
					['userSettings', 'toggleOptions', 'redLetter', 'available'],
					action.redLetter,
				)
				.setIn(
					['userSettings', 'toggleOptions', 'crossReferences', 'available'],
					action.crossReferences,
				);
		case 'persist/REHYDRATE':
			if (
				action.payload.settings &&
				typeof action.payload.settings.setIn === 'function'
			) {
				return action.payload.settings
					.setIn(
						['userSettings', 'toggleOptions', 'redLetter', 'available'],
						state.getIn([
							'userSettings',
							'toggleOptions',
							'redLetter',
							'available',
						]),
					)
					.setIn(
						['userSettings', 'toggleOptions', 'crossReferences', 'available'],
						state.getIn([
							'userSettings',
							'toggleOptions',
							'crossReferences',
							'available',
						]),
					);
			}
			return state;
		default:
			return state;
	}
}

export default settingsReducer;
