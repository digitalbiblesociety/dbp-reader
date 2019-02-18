import React from 'react';
// import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import { AudioDramaToggle } from '..';

const props = {
	audioType: 'audio_drama',
	dispatch: jest.fn(),
};

describe('<AudioDramaToggle />', () => {
	it('Expect to match snapshot', () => {
		const tree = renderer.create(<AudioDramaToggle {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
});
