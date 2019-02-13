import React from 'react';
// import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Text from '..';

// const Verses = dynamic(import('../Verses'), {
// 	loading: () => <LoadingSpinner />,
// });
// const NewChapterArrow = dynamic(import('../../components/NewChapterArrow'), {
// 	loading: () => null,
// });
// const newChapterProps = {
// 	getNewUrl: jest.fn(),
// disabled: false,
// svgid: 'next-arrow',
// svgClasses: string,
// containerClasses: string,
// disabledContainerClasses: string,
// urlProps: {
// 	books,
// 	chapter: activeChapter,
// 	bookId: activeBookId.toLowerCase(),
// 	textId: activeTextId.toLowerCase(),
// 	verseNumber,
// 	text,
// 	audioType,
// },
// clickHandler: jest.fn(),
// }
// jest.mock('next/dynamic', () => () => {
//   const NewChapterArrow = require('../../../components/NewChapterArrow')
//     .default;
//   return (props) => <NewChapterArrow {...props} />;
// });
// Basic Text Props
const text = [
	{
		book_id: 'LUK',
		book_name: 'Luke',
		book_name_alt: 'Luke',
		chapter: 1,
		chapter_alt: '1',
		verse_start: 1,
		verse_start_alt: '1',
		verse_end: 1,
		verse_end_alt: '1',
		verse_text:
			'Since many have undertaken to compile a narrative of the events that have been fulfilled among us,',
	},
	{
		book_id: 'LUK',
		book_name: 'Luke',
		book_name_alt: 'Luke',
		chapter: 1,
		chapter_alt: '1',
		verse_start: 2,
		verse_start_alt: '2',
		verse_end: 2,
		verse_end_alt: '2',
		verse_text:
			'just as those who were eyewitnesses from the beginning and ministers of the word have handed them down to us,',
	},
	{
		book_id: 'LUK',
		book_name: 'Luke',
		book_name_alt: 'Luke',
		chapter: 1,
		chapter_alt: '1',
		verse_start: 3,
		verse_start_alt: '3',
		verse_end: 3,
		verse_end_alt: '3',
		verse_text:
			'I too have decided, after investigating everything accurately anew, to write it down in an orderly sequence for you, most excellent Theophilus,',
	},
	{
		book_id: 'LUK',
		book_name: 'Luke',
		book_name_alt: 'Luke',
		chapter: 1,
		chapter_alt: '1',
		verse_start: 4,
		verse_start_alt: '4',
		verse_end: 4,
		verse_end_alt: '4',
		verse_text:
			'so that you may realize the certainty of the teachings you have received.',
	},
	{
		book_id: 'LUK',
		book_name: 'Luke',
		book_name_alt: 'Luke',
		chapter: 1,
		chapter_alt: '1',
		verse_start: 5,
		verse_start_alt: '5',
		verse_end: 5,
		verse_end_alt: '5',
		verse_text:
			'In the days of Herod, King of Judea, there was a priest named Zechariah of the priestly division of Abijah; his wife was from the daughters of Aaron, and her name was Elizabeth.',
	},
];
const books = [
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
];
const activeChapter = 1;
const hasVideo = true;
const menuIsOpen = true;
const subFooterOpen = true;
const videoPlayerOpen = true;
const changingVersion = true;
const isScrollingDown = true;
const audioPlayerState = true;
const loadingNewChapterText = true;
const chapterTextLoadingState = true;
const audioType = 'audio_drama';
const verseNumber = '';
const activeTextId = 'ENGESV';
const activeBookId = 'LUK';

describe('<Text />', () => {
	it('Should match previous snapshot with all options true', () => {
		const tree = renderer
			.create(
				<Text
					text={text}
					books={books}
					activeChapter={activeChapter}
					hasVideo={hasVideo}
					menuIsOpen={menuIsOpen}
					subFooterOpen={subFooterOpen}
					videoPlayerOpen={videoPlayerOpen}
					changingVersion={changingVersion}
					isScrollingDown={isScrollingDown}
					audioPlayerState={audioPlayerState}
					loadingNewChapterText={loadingNewChapterText}
					chapterTextLoadingState={chapterTextLoadingState}
					audioType={audioType}
					verseNumber={verseNumber}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot with no options true', () => {
		const tree = renderer
			.create(
				<Text
					text={text}
					books={books}
					activeChapter={activeChapter}
					audioType={audioType}
					verseNumber={verseNumber}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot with hasVideo true', () => {
		const tree = renderer
			.create(
				<Text
					text={text}
					books={books}
					activeChapter={activeChapter}
					audioType={audioType}
					hasVideo
					verseNumber={verseNumber}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot with menuIsOpen true', () => {
		const tree = renderer
			.create(
				<Text
					text={text}
					books={books}
					activeChapter={activeChapter}
					audioType={audioType}
					menuIsOpen
					verseNumber={verseNumber}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot with subFooterOpen true', () => {
		const tree = renderer
			.create(
				<Text
					text={text}
					books={books}
					activeChapter={activeChapter}
					audioType={audioType}
					subFooterOpen
					verseNumber={verseNumber}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot with videoPlayerOpen true', () => {
		const tree = renderer
			.create(
				<Text
					text={text}
					books={books}
					activeChapter={activeChapter}
					audioType={audioType}
					videoPlayerOpen
					verseNumber={verseNumber}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot with changingVersion true', () => {
		const tree = renderer
			.create(
				<Text
					text={text}
					books={books}
					activeChapter={activeChapter}
					audioType={audioType}
					changingVersion
					verseNumber={verseNumber}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot with audioPlayerState true', () => {
		const tree = renderer
			.create(
				<Text
					text={text}
					books={books}
					activeChapter={activeChapter}
					audioType={audioType}
					audioPlayerState
					verseNumber={verseNumber}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot with loadingNewChapterText true', () => {
		const tree = renderer
			.create(
				<Text
					text={text}
					books={books}
					activeChapter={activeChapter}
					audioType={audioType}
					loadingNewChapterText
					verseNumber={verseNumber}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot with chapterTextLoadingState true', () => {
		const tree = renderer
			.create(
				<Text
					text={text}
					books={books}
					activeChapter={activeChapter}
					audioType={audioType}
					chapterTextLoadingState
					verseNumber={verseNumber}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
