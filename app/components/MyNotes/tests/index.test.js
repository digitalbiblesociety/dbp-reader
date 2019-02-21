import React from 'react';
import renderer from 'react-test-renderer';
import MyNotes from '..';
import {
	highlights,
	bookmarks,
	vernacularNamesObject,
	notes,
} from '../../../utils/testUtils/notebookFunctions';

const props = {
	getNotes: jest.fn(),
	deleteNote: jest.fn(),
	setPageSize: jest.fn(),
	getBookmarks: jest.fn(),
	getHighlights: jest.fn(),
	setActiveNote: jest.fn(),
	setActivePage: jest.fn(),
	setActiveChild: jest.fn(),
	deleteBookmark: jest.fn(),
	updateHighlight: jest.fn(),
	deleteHighlights: jest.fn(),
	toggleNotesModal: jest.fn(),
	togglePageSelector: jest.fn(),
	listData: notes,
	bookmarkList: bookmarks,
	highlights,
	vernacularNamesObject,
	sectionType: 'notes',
	pageSize: 10,
	totalPages: 1,
	activePage: 1,
	pageSizeBookmark: 10,
	totalPagesBookmark: 1,
	activePageBookmark: 1,
	pageSizeHighlight: 10,
	totalPagesHighlight: 1,
	activePageHighlight: 1,
	pageSelectorState: false,
};

describe('<MyNotes /> container', () => {
	it('should match snapshot with default props', () => {
		const tree = renderer.create(<MyNotes {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot with highlights active', () => {
		const tree = renderer
			.create(<MyNotes {...props} sectionType={'highlights'} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot with bookmarks active', () => {
		const tree = renderer
			.create(<MyNotes {...props} sectionType={'bookmarks'} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should match snapshot with page selector open', () => {
		const tree = renderer
			.create(<MyNotes {...props} pageSelectorState />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
