const osisMap = require('./osisIdMap.json');
const nameMap = require('./bookNameToId.json');

module.exports = (inputId) => {
	const lowercaseInput = inputId.toLowerCase();
	if (osisMap[lowercaseInput]) {
		return osisMap[lowercaseInput];
	} else if (nameMap[lowercaseInput]) {
		return nameMap[lowercaseInput];
	}
	return inputId;
};
