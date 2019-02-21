import React from 'react';
import renderer from 'react-test-renderer';
import MyBookmarks from '..';
import {
	getFormattedNoteDate,
	getNoteReference,
	bookmarks,
} from '../../../utils/testUtils/notebookFunctions';

const props = {
	bookmarks,
	getFormattedNoteDate: jest.fn((params) => getFormattedNoteDate(params)),
	getNoteReference: jest.fn((params) => getNoteReference(params)),
	toggleNotesModal: jest.fn(),
	deleteNote: jest.fn(),
};

describe('<MyBookmarks /> component', () => {
	it('should match snapshot with expected props', () => {
		const tree = renderer.create(<MyBookmarks {...props} />);
		expect(tree).toMatchSnapshot();
	});
});
