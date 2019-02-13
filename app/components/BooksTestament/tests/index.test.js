import React from 'react';
import { mount } from 'enzyme';
import { fromJS } from 'immutable';
import renderer from 'react-test-renderer';
import BooksTestament from '..';

const books = fromJS([
	{
		book_id: 'GEN',
		book_id_usfx: 'GN',
		book_id_osis: 'Gen',
		name: 'Genesis',
		testament: 'OT',
		testament_order: 1,
		book_order: 1,
		book_group: 'The Law',
		chapters: [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20,
			21,
			22,
			23,
			24,
			25,
			26,
			27,
			28,
			29,
			30,
			31,
			32,
			33,
			34,
			35,
			36,
			37,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			46,
			47,
			48,
			49,
			50,
		],
	},
	{
		book_id: 'EXO',
		book_id_usfx: 'EX',
		book_id_osis: 'Exod',
		name: 'Exodus',
		testament: 'OT',
		testament_order: 2,
		book_order: 2,
		book_group: 'The Law',
		chapters: [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20,
			21,
			22,
			23,
			24,
			25,
			26,
			27,
			28,
			29,
			30,
			31,
			32,
			33,
			34,
			35,
			36,
			37,
			38,
			39,
			40,
		],
	},
	{
		book_id: 'LEV',
		book_id_usfx: 'LV',
		book_id_osis: 'Lev',
		name: 'Leviticus',
		testament: 'OT',
		testament_order: 3,
		book_order: 3,
		book_group: 'The Law',
		chapters: [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20,
			21,
			22,
			23,
			24,
			25,
			26,
			27,
		],
	},
]);
const handleRef = jest.fn();
const handleBookClick = jest.fn();
const handleChapterClick = jest.fn();
const activeChapter = 1;
const testamentPrefix = 'ot';
const testamentTitle = 'Old Testament';
const selectedBookName = 'Genesis';
const activeBookName = 'Genesis';
const activeTextId = 'ENGESV';
const audioType = 'drama';

describe('<BooksTestament />', () => {
	it('Should match the old snapshot', () => {
		const tree = renderer
			.create(
				<BooksTestament
					books={books}
					handleRef={handleRef}
					handleBookClick={handleBookClick}
					handleChapterClick={handleChapterClick}
					activeChapter={activeChapter}
					testamentPrefix={testamentPrefix}
					testamentTitle={testamentTitle}
					selectedBookName={selectedBookName}
					activeBookName={activeBookName}
					activeTextId={activeTextId}
					audioType={audioType}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should only render one active book', () => {
		const wrapper = mount(
			<BooksTestament
				books={books}
				handleRef={handleRef}
				handleBookClick={handleBookClick}
				handleChapterClick={handleChapterClick}
				activeChapter={activeChapter}
				testamentPrefix={testamentPrefix}
				testamentTitle={testamentTitle}
				selectedBookName={selectedBookName}
				activeBookName={activeBookName}
				activeTextId={activeTextId}
				audioType={audioType}
			/>,
		);
		expect(wrapper.find('.active-book').length).toEqual(1);
	});
	it('Should only render one active chapter and it should match the given prop', () => {
		const wrapper = mount(
			<BooksTestament
				books={books}
				handleRef={handleRef}
				handleBookClick={handleBookClick}
				handleChapterClick={handleChapterClick}
				activeChapter={activeChapter}
				testamentPrefix={testamentPrefix}
				testamentTitle={testamentTitle}
				selectedBookName={selectedBookName}
				activeBookName={activeBookName}
				activeTextId={activeTextId}
				audioType={audioType}
			/>,
		);
		const chapter = wrapper.find('.active-chapter');
		expect(chapter.length).toEqual(1);
		expect(chapter.text()).toEqual('1');
	});
});
