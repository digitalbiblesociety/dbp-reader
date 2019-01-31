const replaceCharsRegex = new RegExp(/[\r\n※†*✝]/g);

const preorderTraverse = (node, array) => {
	if (!node) {
		return array;
	}
	[...node.childNodes].forEach((child) => {
		array.push(child);
		array = preorderTraverse(child, array); // eslint-disable-line no-param-reassign
	});
	return array;
};

const getFormattedParentVerseNumber = (node, verseNumber) => {
	// Require both parameters -_- type coercion...
	if (!node || (!verseNumber && verseNumber !== 0)) {
		return null;
	}

	// set counter to prevent any possibility of an infinite loop
	let counter = 0;
	let newNode = node;

	while (getFormattedElementVerseId(newNode) !== verseNumber) {
		newNode = newNode.parentNode;
		if (counter >= 10) break;
		counter += 1;
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
	// I don't think I need to check for the class of v but if things break then I may have to
	while (!(newNode.attributes && newNode.attributes['data-id'])) {
		newNode = newNode.parentNode;
		if (counter >= 10) break;
		counter += 1;
	}

	return newNode;
};

const getFormattedChildIndex = (parent, child) => {
	if (!parent || !child) {
		return null;
	}
	const preorderArray = preorderTraverse(parent, []);

	return preorderArray.indexOf(child);
};

const getPlainParentVerse = (node, verseNumber) => {
	// Require both parameters
	if (!node || !verseNumber) {
		return null;
	}
	// set counter to prevent any possibility of an infinite loop
	let counter = 0;
	let newNode = node;

	while (
		!(
			newNode.attributes &&
			newNode.attributes['data-verseid'] &&
			newNode.attributes['data-verseid'].value !== verseNumber
		)
	) {
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

	while (
		!(
			newNode.attributes &&
			newNode.attributes['data-verseid'] &&
			newNode.attributes['data-verseid'].value
		)
	) {
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

// Get the sibling that is closest to the beginning
const getClosestParent = ({
	refNode,
	verse,
	chapter,
	book,
	aParent,
	eParent,
}) => {
	const verseNodes = [
		...refNode.querySelectorAll(`[data-id=${book}${chapter}_${verse}]`),
	];
	const eIndex = verseNodes.indexOf(eParent);
	const aIndex = verseNodes.indexOf(aParent);

	if (aIndex < eIndex) {
		return aParent;
	}
	return eParent;
};

const getOffsetNeededForPsalms = ({ refNode, book, chapter, verse, node }) => {
	const verseNodes = [
		...refNode.querySelectorAll(`[data-id=${book}${chapter}_${verse}]`),
	];

	const previous = verseNodes.slice(0, verseNodes.indexOf(node));

	return previous.reduce(
		(a, c) => a + c.textContent.replace(replaceCharsRegex, '').length,
		0,
	);
};

const getTextInSelectedNodes = ({
	refNode,
	book,
	chapter,
	firstVerse,
	node,
	lastVerse,
}) => {
	if (!refNode || !node) {
		return '';
	}
	// Get all nodes between first and last node
	const verseNodes = [];
	let currentVerse = firstVerse;

	while (currentVerse <= lastVerse) {
		[
			...refNode.querySelectorAll(
				`[data-id=${book}${chapter}_${currentVerse}]`,
			),
		].forEach((v) => verseNodes.push(v));
		currentVerse += 1;
	}

	return verseNodes.reduce(
		(a, c) => a + c.textContent.replace(replaceCharsRegex, '').length,
		0,
	);
};

// Because the system captures the verse numbers this needs to be used
// Can accept plainText boolean as third arg if needed
const calcDistance = (last, first /* plainText */) => {
	// If the last verse is equal to the first verse then I don't need a diff
	if (last === first) return 0;
	let stringDiff = '';

	for (let i = first + 1; i <= last; i += 1) {
		// Adds the length of each verse number
		stringDiff += i.toFixed(0);
		// Adds characters for text to account for spaces in verse numbers
		stringDiff += '11';
	}
	// Gets the total length of the distance neededk

	return stringDiff.length;
};

const getReference = (verseStart, verseEnd, activeBookName, activeChapter) =>
	`${activeBookName} ${activeChapter}:${
		verseStart === verseEnd || !verseEnd
			? verseStart
			: `${verseStart}-${verseEnd}`
	}`;

export {
	getFormattedParentVerseNumber,
	getFormattedParentVerse,
	getPlainParentVerse,
	getTextInSelectedNodes,
	getFormattedChildIndex,
	getFormattedElementVerseId,
	getPlainParentVerseWithoutNumber,
	preorderTraverse,
	getClosestParent,
	getOffsetNeededForPsalms,
	replaceCharsRegex,
	calcDistance,
	getReference,
};
