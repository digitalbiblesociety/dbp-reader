/*
 *
 * Profile actions
 *
 */

import {
	SELECT_ACCOUNT_OPTION,
	TOGGLE_SIGN_IN,
} from './constants';

export const selectAccountOption = (option) => ({
	type: SELECT_ACCOUNT_OPTION,
	option,
});

export const toggleSignInForm = (state) => ({
	type: TOGGLE_SIGN_IN,
	state,
});
