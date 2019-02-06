// import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import ColorPicker from '..';

describe('ColorPicker tests', () => {
	// let wrapper;
	// beforeEach(() => {
	//   wrapper = shallow(<ColorPicker handlePickedColor={jest.fn()} />);
	// });
	// afterEach(() => {
	//   wrapper = null;
	// });
	it('Should render', () => {
		const tree = renderer
			.create(<ColorPicker handlePickedColor={jest.fn()} />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('It should call the handler when an option is clicked', () => {
		// TODO: finish implementing this test.
		expect(true).toBe(true);
	});
});
