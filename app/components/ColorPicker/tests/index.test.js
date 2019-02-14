import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import ColorPicker from '..';

const colorToMatch = 'rgba(84,185,72,.5)';
const handlePickedColor = jest.fn(({ color }) => color);

describe('ColorPicker tests', () => {
	// let wrapper;
	// beforeEach(() => {
	//   wrapper = mount(<ColorPicker handlePickedColor={jest.fn()} />);
	// });
	// afterEach(() => {
	//   wrapper = null;
	// });
	it('Should render', () => {
		const tree = renderer
			.create(<ColorPicker handlePickedColor={handlePickedColor} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('It should call the handler when an option is clicked', () => {
		// TODO: finish implementing this test.
		const wrapper = mount(
			<ColorPicker handlePickedColor={handlePickedColor} />,
		);
		const colorNode = wrapper.find('.green');
		const spy = jest.spyOn(colorNode.props(), 'onClick');
		const colorOutput = colorNode.props().onClick();

		expect(spy).toHaveBeenCalledTimes(1);
		expect(colorOutput).toEqual(colorToMatch);

		colorNode.simulate('click');

		expect(handlePickedColor).toHaveBeenCalledTimes(2);
		expect(wrapper).toBeTruthy();
	});
});
