/*
 *
 * Settings actions
 *
 */

import {
  DEFAULT_ACTION,
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

export function defaultAction() {
	return {
		type: DEFAULT_ACTION,
	};
}

export const updateTheme = ({ theme }) => ({
	type: UPDATE_THEME,
	theme,
});

export const updateFontType = ({ font }) => ({
	type: UPDATE_FONT_TYPE,
	font,
});

export const updateFontSize = ({ size }) => ({
	type: UPDATE_FONT_SIZE,
	size,
});

export const toggleReadersMode = () => ({
	type: TOGGLE_READERS_MODE,
});

export const toggleCrossReferences = () => ({
	type: TOGGLE_CROSS_REFERENCES,
});

export const toggleRedLetter = () => ({
	type: TOGGLE_RED_LETTER,
});

export const toggleJustifiedText = () => ({
	type: TOGGLE_JUSTIFIED_TEXT,
});

export const toggleOneVersePerLine = () => ({
	type: TOGGLE_ONE_VERSE_PER_LINE,
});

export const toggleVerticalScrolling = () => ({
	type: TOGGLE_VERTICAL_SCROLLING,
});
