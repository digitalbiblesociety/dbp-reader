const osisMap = require('./osisIdMap.json');
const nameMap = require('./bookNameToId.json');

module.exports = (inputId) => {
	const lowercaseInput = inputId.toLowerCase();
	console.log('inputId', inputId);
	console.log('osisMap[lowercaseInput]', osisMap[lowercaseInput]);
	console.log('nameMap[lowercaseInput]', nameMap[lowercaseInput]);
	if (osisMap[lowercaseInput]) {
		return osisMap[lowercaseInput];
	} else if (nameMap[lowercaseInput]) {
		return nameMap[lowercaseInput];
	}
	return inputId;
};
