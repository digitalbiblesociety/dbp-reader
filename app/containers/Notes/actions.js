/*
 *
 * Notes actions
 *
 */

import {
	SET_ACTIVE_CHILD,
} from './constants';

export const setActiveChild = (child) => ({
	type: SET_ACTIVE_CHILD,
	child,
});
