/* eslint-disable */

import entries from 'core-js/fn/object/entries';
import values from 'core-js/fn/object/values';
import aIncludes from 'core-js/fn/array/includes';
import includes from 'core-js/library/fn/string/includes';
import find from 'core-js/fn/array/find';
import findIndex from 'core-js/fn/array/find-index';
import iterator from 'core-js/fn/dom-collections/iterator';

if (!Array.findIndex) {
	Array.findIndex = findIndex;
}
if (!Array.find) {
	Array.find = find;
}
if (!Object.values) {
	Object.values = values;
}
if (!Object.entries) {
	Object.entries = entries;
}
if (!String.includes) {
	String.includes = includes;
}
if (!Array.includes) {
	Array.includes = aIncludes;
}
if (
	typeof global !== 'undefined' &&
	global.Intl &&
	!Object.keys(global.Intl).length
) {
	global.Intl = require('intl');
}
/* eslint-enable */
