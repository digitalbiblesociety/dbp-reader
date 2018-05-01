const getFormattedParentVerseNumber = (node, verseNumber) => {
	// Require both parameters -_- type coercion...
	if (!node || (!verseNumber && verseNumber !== 0)) {
		return null;
	}

	// set counter to prevent any possibility of an infinite loop
	let counter = 0;
	let newNode = node;

	while ((getFormattedElementVerseId(newNode) !== verseNumber)) {
		newNode = newNode.parentNode;
		// console.log('new node', newNode);
		// console.log('new node attributes', newNode.attributes);
		if (counter >= 10) break;
		counter += 1;
		// console.log('condition to be checked', !(node.attributes && node.attributes['data-id'] && node.attributes['data-id'].value.split('_')[1] !== firstVerse));
	}

	return newNode;
};

const getFormattedParentVerse = (node) => {
	// Require both parameters
	if (!node) {
		return null;
	}

	// set counter to prevent any possibility of an infinite loop
	let counter = 0;
	let newNode = node;
	// Finds the first parent that has a data-id and a class of .v
	// Both of these things exist only on a verse element
	while (!(newNode.attributes && newNode.attributes['data-id'] && newNode.classList && newNode.classList[0] === 'v')) {
		// console.log('new node', newNode);
		// console.log('new node attributes', newNode.attributes);
		newNode = newNode.parentNode;
		if (counter >= 10) break;
		counter += 1;
		// console.log('condition to be checked', !(node.attributes && node.attributes['data-id'] && node.attributes['data-id'].value.split('_')[1] !== firstVerse));
	}

	return newNode;
};

const getFormattedChildIndex = (parent, child) => {
	if (!parent || !child) {
		return null;
	}
	// default to -1 to simulate default indexOf
	let childIndex = -1;
	let newParent = parent;

	// While there is only one childNode continue iterating
	while (newParent.childNodes.length === 1 && !(child.isSameNode(newParent))) {
		newParent = parent.childNodes[0];
	}

	[...newParent.childNodes].forEach((node, i) => {
		if (node.isSameNode(child) || node.contains(child)) {
			childIndex = i;
		}
	});

	return childIndex;
};

const getPlainParentVerse = (node, verseNumber) => {
	// Require both parameters
	if (!node || !verseNumber) {
		return null;
	}
	// set counter to prevent any possibility of an infinite loop
	let counter = 0;
	let newNode = node;

	while (!(newNode.attributes && newNode.attributes.verseid && newNode.attributes.verseid.value !== verseNumber)) {
		// console.log('newNode', newNode);
		newNode = newNode.parentNode;
		if (counter >= 10) break;
		counter += 1;
	}

	return newNode;
};

const getPlainParentVerseWithoutNumber = (node) => {
	// Require parameter
	if (!node) {
		return null;
	}
	// set counter to prevent any possibility of an infinite loop
	let counter = 0;
	let newNode = node;

	while (!(newNode.attributes && newNode.attributes.verseid && newNode.attributes.verseid.value)) {
		// console.log('newNode', newNode);
		newNode = newNode.parentNode;
		if (counter >= 10) break;
		counter += 1;
	}

	return newNode;
};

const getFormattedElementVerseId = (node) => {
	// check for the data-id attribute since that is what the verse number is stored in
	if (node.attributes && node.attributes['data-id']) {
		return parseInt(node.attributes['data-id'].value.split('_')[1], 10);
	}
	// return null so I can do a check on the values existence
	return null;
};

export {
	getFormattedParentVerseNumber,
	getFormattedParentVerse,
	getPlainParentVerse,
	getFormattedChildIndex,
	getFormattedElementVerseId,
	getPlainParentVerseWithoutNumber,
};
