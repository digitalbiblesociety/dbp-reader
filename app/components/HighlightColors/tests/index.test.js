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
const options = ['None', 'Yellow', 'Green', 'Pink', 'Purple', 'Blue'];
const green = 'rgba(84,185,72,.5)';
const yellow = 'rgba(252,230,0,.5)';
const pink = 'rgba(208,105,169,.5)';
const purple = 'rgba(137,103,172,.5)';
const blue = 'rgba(80,165,220,.5)';
let addHighlight = jest.fn(() => {});
let wrapper;

describe('HighlightColors component', () => {
	beforeEach(() => {
		addHighlight = jest.fn(({ color }) => color);
		wrapper = mount(<HighlightColors addHighlight={addHighlight} />);
	});
	it('should match snapshot', () => {
		const tree = renderer.create(
			<HighlightColors addHighlight={addHighlight} />,
		);
		expect(tree).toMatchSnapshot();
	});
	it('should contain yellow highlight option', () => {
		const colorNode = wrapper.find('.yellow');
		const spy = jest.spyOn(colorNode.props(), 'onClick');
		const colorOutput = colorNode.props().onClick({ clientX: 10, clientY: 10 });

		expect(spy).toHaveBeenCalledTimes(1);
		expect(colorOutput).toEqual(yellow);

		colorNode.simulate('click');

		expect(addHighlight).toHaveBeenCalledTimes(2);
	});
	it('should contain green highlight option', () => {
		const colorNode = wrapper.find('.green');
		const spy = jest.spyOn(colorNode.props(), 'onClick');
		const colorOutput = colorNode.props().onClick({ clientX: 10, clientY: 10 });

		expect(spy).toHaveBeenCalledTimes(1);
		expect(colorOutput).toEqual(green);

		colorNode.simulate('click');

		expect(addHighlight).toHaveBeenCalledTimes(2);
	});
	it('should contain pink highlight option', () => {
		const colorNode = wrapper.find('.pink');
		const spy = jest.spyOn(colorNode.props(), 'onClick');
		const colorOutput = colorNode.props().onClick({ clientX: 10, clientY: 10 });

		expect(spy).toHaveBeenCalledTimes(1);
		expect(colorOutput).toEqual(pink);

		colorNode.simulate('click');

		expect(addHighlight).toHaveBeenCalledTimes(2);
	});
	it('should contain purple highlight option', () => {
		const colorNode = wrapper.find('.purple');
		const spy = jest.spyOn(colorNode.props(), 'onClick');
		const colorOutput = colorNode.props().onClick({ clientX: 10, clientY: 10 });

		expect(spy).toHaveBeenCalledTimes(1);
		expect(colorOutput).toEqual(purple);

		colorNode.simulate('click');

		expect(addHighlight).toHaveBeenCalledTimes(2);
	});
	it('should contain blue highlight option', () => {
		const colorNode = wrapper.find('.blue');
		const spy = jest.spyOn(colorNode.props(), 'onClick');
		const colorOutput = colorNode.props().onClick({ clientX: 10, clientY: 10 });

		expect(spy).toHaveBeenCalledTimes(1);
		expect(colorOutput).toEqual(blue);

		colorNode.simulate('click');

		expect(addHighlight).toHaveBeenCalledTimes(2);
	});
	it('should contain blue highlight option', () => {
		const colorNode = wrapper.find('.none');
		const spy = jest.spyOn(colorNode.props(), 'onClick');
		const colorOutput = colorNode.props().onClick({ clientX: 10, clientY: 10 });

		expect(spy).toHaveBeenCalledTimes(1);
		expect(colorOutput).toEqual('none');

		colorNode.simulate('click');

		expect(addHighlight).toHaveBeenCalledTimes(2);
	});
	it('should contain all the color options', () => {
		const nodes = wrapper.find('.color-text');

		nodes.forEach((node, index) => expect(node.text()).toEqual(options[index]));
	});
});
