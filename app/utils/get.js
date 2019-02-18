// Drop in replacement for lodash/get
// Could error if misused so not as safe
// Is significantly less code
const baseGet = (object, path) => {
	let tempObj = { ...object };
	const tempPath = [...path];
	while (tempObj[tempPath[0]]) {
		tempObj = tempObj[tempPath[0]];
		tempPath.shift();
	}

	return tempPath[0] ? tempObj[tempPath[0]] : tempObj;
};

export default function get(object, path, defaultValue) {
	const result = object == null ? undefined : baseGet(object, path);
	return result === undefined ? defaultValue : result;
}

export { get };
