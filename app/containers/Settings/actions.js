/*
 *
 * Settings actions
 *
 */

import { UPDATE_THEME, UPDATE_FONT_TYPE, UPDATE_FONT_SIZE } from './constants';

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
