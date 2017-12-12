/*
 *
 * Settings reducer
 *
 */

import { fromJS } from 'immutable';
import {
	UPDATE_THEME,
	UPDATE_FONT_TYPE,
	UPDATE_FONT_SIZE,
	TOGGLE_READERS_MODE,
	TOGGLE_CROSS_REFERENCES,
	TOGGLE_RED_LETTER,
	TOGGLE_JUSTIFIED_TEXT,
	TOGGLE_ONE_VERSE_PER_LINE,
	TOGGLE_VERTICAL_SCROLLING,
} from './constants';

const initialState = fromJS({
	activeTheme: 'default',
	activeFont: 'sans-serif',
	activeFontSize: '14px',
	readersMode: false,
	crossReferences: false,
	redLetter: false,
	justifiedText: false,
	oneVersePerLine: false,
	verticalScrolling: true,
});

function settingsReducer(state = initialState, action) {
	switch (action.type) {
	case UPDATE_THEME:
		return state.set('activeTheme', action.theme);
	case UPDATE_FONT_TYPE:
		return state.set('activeFont', action.font);
	case UPDATE_FONT_SIZE:
		return state.set('activeFontSize', action.size);
	case TOGGLE_READERS_MODE:
		return state.set('readersMode', !state.get('readersMode'));
	case TOGGLE_CROSS_REFERENCES:
		return state.set('crossReferences', !state.get('crossReferences'));
	case TOGGLE_RED_LETTER:
		return state.set('redLetter', !state.get('redLetter'));
	case TOGGLE_JUSTIFIED_TEXT:
		return state.set('justifiedText', !state.get('justifiedText'));
	case TOGGLE_ONE_VERSE_PER_LINE:
		return state.set('oneVersePerLine', !state.get('oneVersePerLine'));
	case TOGGLE_VERTICAL_SCROLLING:
		return state.set('verticalScrolling', !state.get('verticalScrolling'));
	default:
		return state;
	}
}

export default settingsReducer;
