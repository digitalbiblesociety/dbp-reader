import React from 'react';
import { mount } from 'enzyme';
import FootnotePortal from '..';

// Mocks
Object.defineProperty(document, 'getElementById', {
	value: (input) => {
		const el = document.createElement('div');
		el.id = input;
		return el;
	},
});

const props = {
	message: 'Please Login.',
	coords: { x: 15, y: 15 },
	closeFootnote: jest.fn(),
};

describe('FootnotePortal component', () => {
	it('should match snapshot with expected props', () => {
		const tree = mount(<FootnotePortal {...props} />);
		expect(tree).toMatchSnapshot();
	});
});
