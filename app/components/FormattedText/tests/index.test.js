/** eslint-env jest */
import { mount } from 'enzyme';
import React from 'react';
import { fromJS } from 'immutable';
import FormattedText from '../index';

const highlights = [];
const bookmarks = [];
const userNotes = [];
const domMethodsAvailable = false;
const activeBookId = 'MAT';
const setFormattedRef = () => {};
const setFootnotes = () => {};
const setFormattedRefHighlight = () => {};
const formattedSource = {
	main:
		'<div class="chapter section ENGESV_70_MAT_1 ENGESV ENG MAT latin" dir="ltr" data-id="ENGESV_70_MAT_1" data-nextid="MAT2" data-previd="MAL4" lang="ENG"><div class="c">1</div><p><span class="verse1 v-num v-1">&#160;1&#160;</span><span class="v MAT1_1" data-id="MAT1_1">The book of the genealogy of Jesus Christ, the son of David, the son of Abraham.</span><span class="verse2 v-num v-2">&#160;2&#160;</span><span class="v MAT1_2" data-id="MAT1_2">Abraham was the father of Isaac, and Isaac the father o..."</span></p></div></div>',
	footnoteSource: '',
};
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

describe('<FormattedText />', () => {
	let wrapper;
	let spyDidMount;

	beforeEach(() => {
		spyDidMount = jest.spyOn(FormattedText.prototype, 'componentDidMount');
		wrapper = mount(
			<FormattedText
				highlights={highlights}
				activeChapter={activeChapter}
				verseNumber={verseNumber}
				userAuthenticated={userAuthenticated}
				userSettings={userSettings}
				activeVerseInfo={activeVerseInfo}
				handleMouseUp={handleMouseUp}
				getFirstVerse={getFirstVerse}
				handleHighlightClick={handleHighlightClick}
				handleNoteClick={handleNoteClick}
				bookmarks={bookmarks}
				userNotes={userNotes}
				domMethodsAvailable={domMethodsAvailable}
				activeBookId={activeBookId}
				setFormattedRef={setFormattedRef}
				setFootnotes={setFootnotes}
				setFormattedRefHighlight={setFormattedRefHighlight}
				formattedSource={formattedSource}
			/>,
		);
	});

	afterEach(() => {
		wrapper = null;
		spyDidMount.mockClear();
	});
	it('Expect it to render', () => {
		expect(spyDidMount).toHaveBeenCalled();
		expect(wrapper.html()).toContain('chapter');
		expect(wrapper.html()).toContain('verse1');
		expect(wrapper.html()).toContain(
			'The book of the genealogy of Jesus Christ, the son of David, the son of Abraham.',
		);
	});
	it('Expect componentDidMount to have been called', () => {
		expect(spyDidMount).toHaveBeenCalled();
	});
	it('Expect the chapter to be defined and equal 1', () => {
		expect(wrapper.props().activeChapter).toEqual(1);
		expect(spyDidMount).toHaveBeenCalledTimes(1);
	});
});
