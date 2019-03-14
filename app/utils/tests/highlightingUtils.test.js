import * as utils from '../highlightingUtils';
import chapter from '../testUtils/sampleFormattedChapter';

// All original nodes referenced are those that would be
// selected by the user in the highlighting process
describe('Highlighting utils methods', () => {
	describe('replaceCharsRegex', () => {
		it('should replace the expected characters', () => {
			const string = '\r\n※†*✝';
			const replacedString = string.replace(utils.replaceCharsRegex, 'a');
			expect(replacedString).toEqual('aaaaaa');
		});
	});
	describe('getReference', () => {
		it('should generate a reference off the given parameters', () => {
			const reference = utils.getReference(1, 3, 'Genesis', 5);

			expect(reference).toEqual('Genesis 5:1-3');
		});
		it('should generate a reference off the given parameters with no verse end', () => {
			const reference = utils.getReference(2, null, 'Genesis', 5);

			expect(reference).toEqual('Genesis 5:2');
		});
	});
	describe('calcDistance', () => {
		it('should calculate the correct distance between first and last verse', () => {
			expect(utils.calcDistance(5, 1)).toEqual(12);
		});
		it('should calculate the correct distance between first and last verse when they are the same', () => {
			expect(utils.calcDistance(5, 5)).toEqual(0);
		});
		it('should calculate the correct distance between first and last verse when 1 apart', () => {
			expect(utils.calcDistance(11, 10)).toEqual(4);
		});
	});
	describe('preorderTraverse', () => {
		it('should perform a preorder traversal of the given dom tree', () => {
			const tree = document.createElement('div');
			const first = document.createElement('div');
			const second = document.createElement('div');
			const third = document.createElement('div');
			const fourth = document.createElement('div');
			const fifth = document.createElement('div');

			first.innerText = 'first';
			second.innerText = 'second';
			fourth.innerText = 'fourth';
			fifth.innerText = 'fifth';
			third.innerText = 'third';

			second.appendChild(third);
			fourth.appendChild(fifth);
			first.appendChild(second);
			first.appendChild(fourth);
			tree.appendChild(first);

			expect(utils.preorderTraverse(tree, [])).toEqual([
				first,
				second,
				third,
				fourth,
				fifth,
			]);
		});
		it('should return an array if no valid node is provided', () => {
			expect(utils.preorderTraverse(null, [])).toEqual([]);
		});
	});
	describe('getFormattedParentVerseNumber', () => {
		it('should get the parent element for a formatted verse', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const node = tree.querySelector('.MAT1_4');
			const verseNumber = utils.getFormattedParentVerseNumber(
				node.firstChild,
				4,
			);

			expect(verseNumber).toEqual(node);
		});
		it('should return null if the node is not valid', () => {
			const verseNumber = utils.getFormattedParentVerseNumber(null, 4);

			expect(verseNumber).toEqual(null);
		});
		it('should return null if the verse number is not valid', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const node = tree.querySelector('.MAT1_4');
			const verseNumber = utils.getFormattedParentVerseNumber(
				node.firstChild,
				null,
			);

			expect(verseNumber).toEqual(null);
		});
		it('should throw if it cannot find the verse element', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const node = tree.querySelector('.MAT1_4');

			expect(() =>
				utils.getFormattedParentVerseNumber(node.firstChild, 38),
			).toThrow();
		});
	});
	describe('getPlainParentVerse', () => {
		it('should get the parent node for a plain text verse', () => {
			const tree = document.createElement('div');
			tree.innerHTML = `<div class="chapter">
				<span data-verseid="1">verse 1 text</span>
				<span data-verseid="2">verse 2 text</span>
				<span data-verseid="3">verse 3 text</span>
				<span data-verseid="4">verse 4 text</span>
				<span data-verseid="5">verse 5 text</span>
				<span data-verseid="6">verse 6 text</span>
				<span data-verseid="7">verse 7 text</span>
				<span data-verseid="8">verse 8 text</span>
				<span data-verseid="9">verse 9 text</span>
				<span data-verseid="10">verse 10 text</span>
				<span data-verseid="11">verse 11 text</span>
				<span data-verseid="12">verse 12 text</span>
				<span data-verseid="13">verse 13 text</span>
				</div>`;
			const node = tree.querySelector("[data-verseid='11']");

			expect(utils.getPlainParentVerse(node.firstChild, 11)).toEqual(node);
		});
		it('should return null if no verse number is supplied', () => {
			const tree = document.createElement('div');
			tree.innerHTML = `<div class="chapter">
				<span data-verseid="1">verse 1 text</span>
				<span data-verseid="2">verse 2 text</span>
				<span data-verseid="3">verse 3 text</span>
				<span data-verseid="4">verse 4 text</span>
				<span data-verseid="5">verse 5 text</span>
				<span data-verseid="6">verse 6 text</span>
				<span data-verseid="7">verse 7 text</span>
				<span data-verseid="8">verse 8 text</span>
				<span data-verseid="9">verse 9 text</span>
				<span data-verseid="10">verse 10 text</span>
				<span data-verseid="11">verse 11 text</span>
				<span data-verseid="12">verse 12 text</span>
				<span data-verseid="13">verse 13 text</span>
				</div>`;
			const node = tree.querySelector("[data-verseid='11']");

			expect(utils.getPlainParentVerse(node.firstChild, null)).toEqual(null);
		});
		it('should return null if no valid dom node is supplied', () => {
			expect(utils.getPlainParentVerse(null, 11)).toEqual(null);
		});
	});
	describe('getFormattedParentVerse', () => {
		it('should get the parent element for a formatted verse', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const expectedNode = tree.querySelector('.MAT1_22');
			const highlightNode = tree.querySelector('em');
			const verseNode = utils.getFormattedParentVerse(highlightNode.firstChild);

			expect(verseNode).toEqual(expectedNode);
		});
		it('should return null if no node was given', () => {
			const verseNode = utils.getFormattedParentVerse(null);

			expect(verseNode).toEqual(null);
		});
	});
	describe('getFormattedChildIndex', () => {
		it("should return the index of the node within the verse's subtree", () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const parent = tree.querySelector('.MAT1_24');
			const expectedIndex = 8;
			/* Process to arrive at index (index is 0 based)
				<span class="v MAT1_24" data-id="MAT1_24">
				0	<span>
				1		When
				2		<em class="text-highlighted" style="background:linear-gradient(rgba(...),rgba(...))">
				3			Joseph woke from sleep</em>
				4		, he did as the
				5		<em class="text-highlighted" style="background:linear-gradient(rgba(...),rgba(...))">
				6			angel of the
				7				<em class="text-highlighted" style="background:linear-gradient(rgba(...),rgba(...))">
				8 ->			Lord</em>
							commanded him</em>
						: he took his wife,
					</span>
				</span>
			*/
			// Node I am selecting is 4th highlighted section in the text
			const highlightNode = tree.querySelectorAll('em')[3];
			const verseNode = utils.getFormattedChildIndex(
				parent,
				highlightNode.firstChild,
			);

			expect(verseNode).toEqual(expectedIndex);
		});
		it('should return null if no parent node was given', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const highlightNode = tree.querySelectorAll('em')[3];
			const verseNode = utils.getFormattedChildIndex(
				null,
				highlightNode.firstChild,
			);

			expect(verseNode).toEqual(null);
		});
		it('should return null if no child node was given', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const parent = tree.querySelector('.MAT1_24');
			const verseNode = utils.getFormattedChildIndex(parent, null);

			expect(verseNode).toEqual(null);
		});
	});
	describe('getPlainParentVerseWithoutNumber', () => {
		it('should get the parent node for a plain text verse', () => {
			const tree = document.createElement('div');
			tree.innerHTML = `<div class="chapter">
				<span data-verseid="1">verse 1 text</span>
				<span data-verseid="2">verse 2 text</span>
				<span data-verseid="3">verse 3 text</span>
				<span data-verseid="4">verse 4 text</span>
				<span data-verseid="5">verse 5 text</span>
				<span data-verseid="6">verse 6 text</span>
				<span data-verseid="7">verse 7 text</span>
				<span data-verseid="8">verse 8 text</span>
				<span data-verseid="9">verse 9 text</span>
				<span data-verseid="10">verse 10 text</span>
				<span data-verseid="11">verse <em>11</em> text</span>
				<span data-verseid="12">verse 12 text</span>
				<span data-verseid="13">verse 13 text</span>
				</div>`;
			const node = tree.querySelector("[data-verseid='11']");
			const childNode = tree.querySelector('em');

			expect(
				utils.getPlainParentVerseWithoutNumber(childNode.firstChild),
			).toEqual(node);
		});
		it('should return node 10 levels up if the tree is too deep', () => {
			const tree = document.createElement('div');
			tree.innerHTML = `<div class="chapter">
				<span data-verseid="1">verse 1 text</span>
				<span data-verseid="2">verse 2 text</span>
				<span data-verseid="3">verse 3 text</span>
				<span data-verseid="4">verse 4 text</span>
				<span data-verseid="5">verse 5 text</span>
				<span data-verseid="6">verse 6 text</span>
				<span data-verseid="7">verse 7 text</span>
				<span data-verseid="8">verse 8 text</span>
				<span data-verseid="9">verse 9 text</span>
				<span data-verseid="10">verse 10 text</span>
				<span data-verseid="11">verse <em>11</em> text</span>
				<span data-verseid="12">verse 12 text</span>
				<span data-verseid="13"><em>1<em>2<em>3<em>4<em>5<em>6<em>7<em>8<em>9<em>10<em>11<em>12<em>13<em>mid</em>13</em>12</em>11</em>10</em>9</em>8</em>7</em>6</em>5</em>4</em>3</em>2</em>1</em></span>
				</div>`;
			const childNode = tree.querySelectorAll('em')[13];
			const expectedNode = tree.querySelectorAll('em')[3];

			expect(
				utils.getPlainParentVerseWithoutNumber(childNode.firstChild),
			).toEqual(expectedNode);
		});
		it('should return null if no valid dom node is supplied', () => {
			expect(utils.getPlainParentVerseWithoutNumber(null)).toEqual(null);
		});
	});
	describe('getClosestParent', () => {
		it('should get the parent element for a formatted verse', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const aParent = tree.querySelectorAll("[data-id='MAT1_25']")[0];
			const eParent = tree.querySelectorAll("[data-id='MAT1_25']")[1];

			expect(
				utils.getClosestParent({
					refNode: tree,
					verse: 25,
					chapter: 1,
					book: 'MAT',
					aParent,
					eParent,
				}),
			).toEqual(aParent);
		});
		it('should get the parent element for a formatted verse', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const aParent = tree.querySelectorAll("[data-id='MAT1_25']")[1];
			const eParent = tree.querySelectorAll("[data-id='MAT1_25']")[0];

			expect(
				utils.getClosestParent({
					refNode: tree,
					verse: 25,
					chapter: 1,
					book: 'MAT',
					aParent,
					eParent,
				}),
			).toEqual(eParent);
		});
	});
	describe('getTextInSelectedNodes', () => {
		it('should get the text out of multiple formatted verse nodes', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const firstVerse = 1;
			const lastVerse = 3;
			// Got the text of the first three verses
			const expectedText = 'The book of the genealogy of Jesus Christ, the son of David, the son of Abraham.Abraham was the father of Isaac, and Isaac the father of Jacob, and Jacob the father of Judah and his brothers,and Judah the father of Perez and Zerah by Tamar, and Perez the father of Hezron, and Hezron the father of Ram,'
				.length;

			expect(
				utils.getTextInSelectedNodes({
					refNode: tree,
					node: tree,
					chapter: 1,
					book: 'MAT',
					firstVerse,
					lastVerse,
				}),
			).toEqual(expectedText);
		});
		it('should return empty string if node is not valid', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const firstVerse = 1;
			const lastVerse = 3;

			expect(
				utils.getTextInSelectedNodes({
					refNode: tree,
					chapter: 1,
					book: 'MAT',
					firstVerse,
					lastVerse,
				}),
			).toEqual('');
		});
		it('should return empty string if refNode is not valid', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			const firstVerse = 1;
			const lastVerse = 3;

			expect(
				utils.getTextInSelectedNodes({
					node: tree,
					chapter: 1,
					book: 'MAT',
					firstVerse,
					lastVerse,
				}),
			).toEqual('');
		});
	});
	describe('getOffsetNeededForPsalms', () => {
		it('should get the text out of multiple formatted verse nodes', () => {
			const tree = document.createElement('div');

			tree.innerHTML = chapter;

			/* Calculated offset needed based on the text in brackets
				<div class="q">
					<span class="verse26 v-num v-26">&nbsp;26&nbsp;</span>
					<span class="v MAT1_26" data-id="MAT1_26">
						<span class="note" id="note-101"><a class="key">※</a></span>
			->		[ Blessed are the meek, ]
						<span class="note" id="note-102"><a class="key">†</a></span>
					</span>
				</div>
				<div class="q MAT1_26" data-id="MAT1_26">for they will inherit the land.</div>
			*/
			const expectedText = ' Blessed are the meek, '.length;

			expect(
				utils.getOffsetNeededForPsalms({
					refNode: tree,
					node: tree,
					chapter: 1,
					book: 'MAT',
					verse: 26,
				}),
			).toEqual(expectedText);
		});
	});
});
