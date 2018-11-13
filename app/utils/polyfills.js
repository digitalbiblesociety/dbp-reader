/* eslint-disable */

import entries from 'core-js/fn/object/entries';
import values from 'core-js/fn/object/values';
if (!Object.values) {
	Object.values = values;
}
if (!Object.entries) {
	Object.entries = entries;
}
if (
	typeof global !== 'undefined' &&
	global.Intl &&
	!Object.keys(global.Intl).length
) {
	global.Intl = require('intl');
}
/* eslint-enable */
