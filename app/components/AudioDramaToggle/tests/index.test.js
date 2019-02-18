import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { AudioDramaToggle } from '..';

const props = {
	audioType: 'audio_drama',
	dispatch: jest.fn((action) => action),
};

describe('<AudioDramaToggle />', () => {
	it('Expect to match snapshot for drama audio', () => {
		const tree = renderer.create(<AudioDramaToggle {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Expect to match snapshot for plain audio', () => {
		const tree = renderer.create(<AudioDramaToggle {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('mount and have two different buttons', () => {
		const wrapper = mount(<AudioDramaToggle {...props} />);
		const dramaButton = wrapper.find('#drama-button');
		const nonDramaButton = wrapper.find('#non-drama-button');
		const dramaSpy = jest.spyOn(wrapper.instance(), 'setTypeToDrama');
		const nonDramaSpy = jest.spyOn(wrapper.instance(), 'setTypeToNonDrama');

		wrapper.instance().forceUpdate();
		expect(dramaButton).toHaveLength(1);
		expect(nonDramaButton).toHaveLength(1);

		dramaButton.simulate('click');
		expect(dramaSpy).toHaveBeenCalledTimes(1);

		nonDramaButton.simulate('click');
		expect(nonDramaSpy).toHaveBeenCalled();
	});
});
