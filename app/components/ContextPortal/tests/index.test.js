import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { ContextPortal } from '..';
import PopupMessage from '../../PopupMessage';

/* eslint-disable react/prop-types */
jest.mock('react-intl', () => ({
	FormattedMessage: ({ defaultMessage }) => <span>{defaultMessage}</span>,
	defineMessages: (messages) => messages,
}));
jest.mock('../../PopupMessage', () => ({ styles, message, x, y }) => (
	<div
		style={{ top: y - 50, left: x - 87.5, ...styles }}
		className={'custom-popup'}
	>
		{message ? (
			<p>{message}</p>
		) : (
			<p>
				If you believe this to be an error please{' '}
				<a
					className={'logo'}
					href={'https://support.bible.is/contact'}
					title={'https://support.bible.is/contact'}
					target={'_blank'}
					rel={'noopener'}
				>
					contact support
				</a>
				.
			</p>
		)}
	</div>
));
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
		const tree = renderer.create(<ContextPortal {...props} />).toJSON();

		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot if ie is active', () => {
		const tree = renderer.create(<ContextPortal {...props} isIe />).toJSON();

		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot if notes menu is active', () => {
		const tree = renderer
			.create(<ContextPortal {...props} notesActive />)
			.toJSON();

		expect(tree).toMatchSnapshot();
	});
	it('Should match previous snapshot if popup menu is active', () => {
		const tree = renderer.create(<ContextPortal {...props} />);
		const instance = tree.getInstance();
		instance.setState({
			openPopup: true,
			coords: { x: 15, y: 15 },
		});
		const json = tree.toJSON();

		expect(json).toMatchSnapshot();
	});
	it('Should match previous snapshot if highlight menu is open', () => {
		const tree = renderer.create(<ContextPortal {...props} />);
		const instance = tree.getInstance();
		instance.setState({
			highlightOpen: true,
		});
		const json = tree.toJSON();

		expect(json).toMatchSnapshot();
	});
	it('Should render a div containing given book and chapter', () => {
		const wrapper = mount(<ContextPortal {...props} />);

		expect(wrapper).toBeTruthy();
	});
});
