import React from 'react';
import { shallow, mount } from 'enzyme';
import Text from 'containers/Text';
import { fromJS } from 'immutable';
import jsonProps from './highlightFormattedTextProps.json';
import jsonState from './highlightFormattedTextState.json';

const textProps = {
	text: [], // array
	userNotes: [], // array
	bookmarks: [], // array
	highlights: [], // array
	userSettings: fromJS({}), // object
	formattedSource: fromJS({}), // object
	nextChapter: () => {}, // func
	prevChapter: () => {}, // func
	addBookmark: () => {}, // func
	addHighlight: () => {}, // func
	goToFullChapter: () => {}, // func
	toggleNotesModal: () => {}, // func
	setActiveNotesView: () => {}, // func
	toggleInformationModal: () => {}, // func
	setActiveNote: () => {}, // func
	activeChapter: 1, // number
	notesActive: true, // bool
	invalidBibleId: true, // bool
	informationActive: true, // bool
	userAuthenticated: true, // bool
	loadingNewChapterText: true, // bool
	userId: '', // string
	bibleId: '', // string
	verseNumber: '', // string
	activeBookId: '', // string
	activeBookName: '', // string
};

describe('<Text />', () => {
	it('Expect to have unit tests specified', () => {
		expect(true).toEqual(true);
	});
	describe('addHighlight', () => {
		let wrapper;

		beforeEach(() => {
			wrapper = shallow(<Text {...textProps} />);
			wrapper.instance().state = {
				contextMenuState: false,
				footnoteState: false,
				coords: {},
				selectedText: '',
				firstVerse: 0,
				lastVerse: 0,
				highlightActive: textProps.highlights || false,
				handlersAreSet: false,
			};
		});
		it('Should be defined', () => {
			expect(wrapper.instance().addHighlight).toBeDefined();
		});
		it('Should be a function', () => {
			expect(typeof wrapper.instance().addHighlight === 'function').toEqual(true);
		});
		xit('Should create a highlight object for plain text left to right in same verse', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for plain text left to right spanning two verses', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for plain text left to right in same verse that overlaps another highlight', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for plain text left to right in same verse where start is not on a verse', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for plain text left to right spanning two verses and that overlaps another highlight', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right in same verse', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right spanning two verses', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right in same verse that overlaps another highlight', () => {
			expect(true).toEqual(false);
		});
		it('Should create a highlight object for formatted text left to right that has another non-overlapping highlight in same verse', () => {
			const mountWrap = mount(<Text {...jsonProps.verseHasHighlight} formattedSource={fromJS(jsonProps.verseHasHighlight.formattedSource)} userSettings={fromJS(jsonProps.verseHasHighlight.userSettings)} />);
			const expectedObject = {
				chapter: 6,
				verse_start: 7,
				highlight_start: 40,
				highlighted_words: 6,
				highlighted_color: '#86A',
				bible_id: 'ENGWEB',
				book_id: 'MAT',
			};
			mountWrap.setState({ ...jsonState.verseHasHighlight });
			// mountWrap.update();
			// console.log(mountWrap.find('main').children('.v.MAT6_6'));
			// Gets the rendered element
			// console.log(mountWrap.find('main').children().forEach((c) => console.log('child exists', c.render())));
			// console.log(mountWrap.find('.wj'));
			// console.log(mountWrap.find('arrow-wrapper'));
			// expect(mountWrap.instance().addHighlight({ color: '#000', popupCoords: { x: 0, y: 0 } })).toEqual(expectedObject);
			expect(true).toBe(expectedObject);
			mountWrap.unmount();
		});
		xit('Should create a highlight object for formatted text left to right in same verse that overlaps a footnote', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right in same verse that overlaps a note', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right in same verse that overlaps a bookmark', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right in same verse that overlaps words of Jesus', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right in same verse that overlaps another element', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right in same verse where start is not on a verse', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right spanning two verses and overlaps another highlight', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right spanning two verses and overlaps a footnote', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right spanning two verses and overlaps a note', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right spanning two verses and overlaps a bookmark', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right spanning two verses and overlaps words of Jesus', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right spanning two verses and overlaps another element', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right spanning two verses where both verses are split into quotes', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text left to right in the same verse where the verse is split into quotes', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for plain text right to left in same verse', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for plain text right to left spanning two verses', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for plain text right to left in same verse that overlaps another highlight', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for plain text right to left in same verse where start is not on a verse', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for plain text right to left spanning two verses and that overlaps another highlight', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left in same verse', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left spanning two verses', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left in same verse that overlaps another highlight', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left in same verse that overlaps a footnote', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left in same verse that overlaps a note', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left in same verse that overlaps a bookmark', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left in same verse that overlaps words of Jesus', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left in same verse that overlaps another element', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left in same verse where start is not on a verse', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left spanning two verses and overlaps another highlight', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left spanning two verses and overlaps a footnote', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left spanning two verses and overlaps a note', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left spanning two verses and overlaps a bookmark', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left spanning two verses and overlaps words of Jesus', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left spanning two verses and overlaps another element', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left spanning two verses where both verses are split into quotes', () => {
			expect(true).toEqual(false);
		});
		xit('Should create a highlight object for formatted text right to left in the same verse where the verse is split into quotes', () => {
			expect(true).toEqual(false);
		});
	});
});
