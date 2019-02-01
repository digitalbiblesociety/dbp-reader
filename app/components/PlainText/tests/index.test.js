/** eslint-env jest */
import { mount } from 'enzyme';
import React from 'react';
import { fromJS } from 'immutable';
import PlainText from '../index';
/*
	PlainText.propTypes = {
	highlights: PropTypes.array,
	initialText: PropTypes.array,
	activeChapter: PropTypes.number,
	verseNumber: PropTypes.string,
	userAuthenticated: PropTypes.bool,
	userSettings: PropTypes.object,
	activeVerseInfo: PropTypes.object,
	handleMouseUp: PropTypes.func,
	getFirstVerse: PropTypes.func,
	handleHighlightClick: PropTypes.func,
	handleNoteClick: PropTypes.func,
};
*/
const highlights = [
	{
		id: 24436919,
		bible_id: 'ENGNAB',
		book_id: 'LUK',
		book_name: 'luke',
		chapter: 1,
		verse_start: 1,
		highlight_start: 1,
		highlighted_words: 0,
		highlighted_color: 'rgba(173,221,121,0.7)',
		tags: [],
	},
	{
		id: 26056502,
		bible_id: 'ENGNAB',
		book_id: 'LUK',
		book_name: 'luke',
		chapter: 1,
		verse_start: 4,
		highlight_start: 0,
		highlighted_words: 10,
		highlighted_color: 'rgba(80,165,220,0.5)',
		tags: [],
	},
];
const initialText = [
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
const activeChapter = 1;
const verseNumber = '';
const userAuthenticated = true;
const userSettings = fromJS({
	activeTheme: 'red',
	activeFontType: 'sans',
	activeFontSize: 42,
	toggleOptions: {
		readersMode: {
			name: "READER'S MODE",
			active: false,
			available: true,
		},
		crossReferences: {
			name: 'CROSS REFERENCE',
			active: true,
			available: true,
		},
		redLetter: {
			name: 'RED LETTER',
			active: true,
			available: true,
		},
		justifiedText: {
			name: 'JUSTIFIED TEXT',
			active: true,
			available: true,
		},
		oneVersePerLine: {
			name: 'ONE VERSE PER LINE',
			active: false,
			available: true,
		},
		verticalScrolling: {
			name: 'VERTICAL SCROLLING',
			active: false,
			available: false,
		},
	},
	autoPlayEnabled: false,
});
const activeVerseInfo = { verse: 0 };
const handleMouseUp = () => {};
const getFirstVerse = () => {};
const handleHighlightClick = () => {};
const handleNoteClick = () => {};
describe('<PlainText />', () => {
	it('Expect it to render', () => {
		const text = mount(
			<PlainText
				highlights={highlights}
				initialText={initialText}
				activeChapter={activeChapter}
				verseNumber={verseNumber}
				userAuthenticated={userAuthenticated}
				userSettings={userSettings}
				activeVerseInfo={activeVerseInfo}
				handleMouseUp={handleMouseUp}
				getFirstVerse={getFirstVerse}
				handleHighlightClick={handleHighlightClick}
				handleNoteClick={handleNoteClick}
			/>,
		);

		expect(text.find('.chapter')).toBeTruthy();
	});
});
