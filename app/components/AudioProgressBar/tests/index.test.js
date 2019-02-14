import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import AudioProgressBar from '..';

const setCurrentTime = jest.fn();
const duration = 300;
const currentTime = 0;

describe('AudioProgressBar Component', () => {
	it('Should match previous snapshot', () => {
		const tree = renderer.create(
			<AudioProgressBar
				duration={duration}
				currentTime={currentTime}
				setCurrentTime={setCurrentTime}
			/>,
		);

		expect(tree).toMatchSnapshot();
	});
	it('Should render a div containing given duration and currentTime', () => {
		const wrapper = mount(
			<AudioProgressBar
				duration={duration}
				currentTime={currentTime}
				setCurrentTime={setCurrentTime}
			/>,
		);
		const style = wrapper.find('.rc-slider-track').get(1).props.style;
		const expectedWidth = `${(100 * (currentTime / duration)).toFixed(0)}%`;

		expect(wrapper.find('.rc-slider-track')).toBeTruthy();
		expect(style).toHaveProperty('width', expectedWidth);
	});
	it('Should render the slider at the correct position', () => {
		const newCurrentTime = 5;
		const wrapper = mount(
			<AudioProgressBar
				duration={duration}
				currentTime={newCurrentTime}
				setCurrentTime={setCurrentTime}
			/>,
		);
		const style = wrapper.find('.rc-slider-track').get(1).props.style;
		const expectedWidth = `${(100 * (newCurrentTime / duration)).toFixed(0)}%`;

		expect(wrapper.find('.rc-slider-track')).toBeTruthy();
		expect(style).toHaveProperty('width', expectedWidth);
	});
});
