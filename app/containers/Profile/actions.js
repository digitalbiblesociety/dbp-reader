/*
 *
 * Profile actions
 *
 */

import {
	SELECT_ACCOUNT_OPTION,
} from './constants';

export function selectAccountOption(option) {
	return {
		type: SELECT_ACCOUNT_OPTION,
		option,
	};
}
