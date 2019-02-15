import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import HighlightColors from '..';

/* eslint-disable react/prop-types */
jest.mock('react-intl', () => ({
	FormattedMessage: ({ defaultMessage }) => <span>{defaultMessage}</span>,
	defineMessages: (messages) => messages,
}));
/* eslint-enable react/prop-types */

const green = 'rgba(84,185,72,.5)';
const yellow = 'rgba(252,230,0,.5)';
const pink = 'rgba(208,105,169,.5)';
const purple = 'rgba(137,103,172,.5)';
const blue = 'rgba(80,165,220,.5)';
let addHighlight = jest.fn(() => {});
let wrapper;

describe('HighlightColors component', () => {
	beforeEach(() => {
		wrapper = mount(<HighlightColors addHighlight={addHighlight} />);
		addHighlight = jest.fn(({ color }) => color);
	});
	it('should match snapshot', () => {
		const tree = renderer.create(
			<HighlightColors addHighlight={addHighlight} />,
		);
		expect(tree).toMatchSnapshot();
	});
	it('should contain yellow highlight option', () => {
		const colorSpan = wrapper.find('.yellow');
		colorSpan.simulate('click');

		expect(addHighlight).toHaveBeenCalledTimes(1);
		expect(colorSpan.text()).toEqual('yellow');
	});
	it('should contain green highlight option', () => {
		const colorSpan = wrapper.find('.green');
		colorSpan.simulate('click');

		expect(addHighlight).toHaveBeenCalledTimes(1);
		expect(colorSpan.text()).toEqual('green');
	});
	it('should contain pink highlight option', () => {
		const colorSpan = wrapper.find('.pink');
		colorSpan.simulate('click');

		expect(addHighlight).toHaveBeenCalledTimes(1);
		expect(colorSpan.text()).toEqual('pink');
	});
	it('should contain purple highlight option', () => {
		const colorSpan = wrapper.find('.purple');
		colorSpan.simulate('click');

		expect(addHighlight).toHaveBeenCalledTimes(1);
		expect(colorSpan.text()).toEqual('purple');
	});
	it('should contain blue highlight option', () => {
		const colorSpan = wrapper.find('.blue');
		colorSpan.simulate('click');

		expect(addHighlight).toHaveBeenCalledTimes(1);
		expect(colorSpan.text()).toEqual('blue');
	});
});
