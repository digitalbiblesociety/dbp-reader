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
	SAVE_SETTINGS,
	UNDO_SETTINGS,
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

export const saveSettings = () => ({
	type: SAVE_SETTINGS,
});

export const undoSettings = () => ({
	type: UNDO_SETTINGS,
});
