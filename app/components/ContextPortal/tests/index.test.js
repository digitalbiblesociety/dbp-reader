import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { ContextPortal } from '..';

/* eslint-disable react/prop-types */
jest.mock('react-intl', () => ({
	FormattedMessage: ({ defaultMessage }) => <span>{defaultMessage}</span>,
	defineMessages: (messages) => messages,
}));
/* eslint-enable react/prop-types */

const props = {
	selectedText: 'For all have sinned and fallen short of the glory of God.',
	coordinates: { x: 150, y: 150 },
	notesActive: false,
	isIe: false,
	addHighlight: jest.fn(),
	setActiveNote: jest.fn(),
	addFacebookLike: jest.fn(),
	toggleNotesModal: jest.fn(),
	closeContextMenu: jest.fn(),
	handleAddBookmark: jest.fn(),
	setActiveNotesView: jest.fn(),
};

describe('ContextPortal Component', () => {
	it('Should match previous snapshot', () => {
		const tree = renderer.create(<ContextPortal {...props} />);

		expect(tree).toMatchSnapshot();
	});
	it('Should render a div containing given book and chapter', () => {
		const wrapper = mount(<ContextPortal {...props} />);

		expect(wrapper).toBeTruthy();
	});
});
