import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Chapter from '..';

const clickMessage = 'click-handler';

describe('<Chapter />', () => {
	it('Should render', () => {
		const wrapper = shallow(
			<Chapter
				clickHandler={jest.fn(() => clickMessage)}
				chapter={1}
				active
				href={''}
				as={''}
			/>,
		);
		expect(wrapper.text()).toEqual('1');
	});
	it('Should render for active chapter', () => {
		const wrapper = shallow(
			<Chapter
				clickHandler={jest.fn(() => clickMessage)}
				chapter={1}
				active
				href={''}
				as={''}
			/>,
		);
		expect(wrapper.find('.active-chapter').length).toEqual(1);
	});
	it('Should render for inactive chapter', () => {
		const wrapper = shallow(
			<Chapter
				clickHandler={jest.fn(() => clickMessage)}
				chapter={1}
				href={''}
				as={''}
			/>,
		);
		expect(wrapper.find('.active-chapter').length).toEqual(0);
	});
	it('Should match snapshot for active chapter', () => {
		const tree = renderer
			.create(
				<Chapter
					clickHandler={jest.fn(() => clickMessage)}
					chapter={1}
					active
					href={''}
					as={''}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should match snapshot for inactive chapter', () => {
		const tree = renderer
			.create(
				<Chapter
					clickHandler={jest.fn(() => clickMessage)}
					chapter={1}
					href={''}
					as={''}
				/>,
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('Should correctly fire click event', () => {
		const wrapper = shallow(
			<Chapter
				clickHandler={jest.fn(() => clickMessage)}
				chapter={1}
				active
				href={''}
				as={''}
			/>,
		);
		const anchor = wrapper.find('a');
		const spy = jest.spyOn(anchor.props(), 'onClick');

		anchor.simulate('click');
		expect(spy).toHaveBeenCalledTimes(1);

		const clickResult = anchor.props().onClick();

		expect(spy).toHaveBeenCalledTimes(2);
		expect(clickResult).toEqual(clickMessage);
	});
});
