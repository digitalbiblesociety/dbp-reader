import React from 'react';
import { shallow } from 'enzyme';
import Text from 'containers/Text';
import { fromJS } from 'immutable';

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
		});
		it('Should be defined', () => {
			expect(wrapper.instance().addHighlight).toBeDefined();
		});
		it('Should be a function', () => {
			expect(typeof wrapper.instance().addHighlight === 'function').toEqual(true);
		});
	});
});
