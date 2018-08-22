/* eslint-disable */
export default function(array, prop) {
	return array.filter((obj, pos, arr) => {
		return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
	});
}
/* eslint-enable */
