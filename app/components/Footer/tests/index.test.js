import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import Footer from '..';

const props = {
	settingsActive: false,
	profileActive: false,
	searchActive: false,
	notebookActive: false,
	isScrollingDown: false,
	toggleNotebook: jest.fn(),
	toggleSettingsModal: jest.fn(),
	toggleProfile: jest.fn(),
	toggleSearch: jest.fn(),
};
let wrapper;

describe('Footer component tests', () => {
	beforeEach(() => {
		props.toggleNotebook = jest.fn(toggleNotebook);
		props.toggleSettingsModal = jest.fn(toggleSettingsModal);
		props.toggleProfile = jest.fn(toggleProfile);
		props.toggleSearch = jest.fn(toggleSearch);

		wrapper = mount(<Footer {...props} />);

		function toggleNotebook() {
			wrapper.setProps({ notebookActive: !wrapper.props().notebookActive });
		}
		function toggleSettingsModal() {
			wrapper.setProps({ settingsActive: !wrapper.props().settingsActive });
		}
		function toggleProfile() {
			wrapper.setProps({ profileActive: !wrapper.props().profileActive });
		}
		function toggleSearch() {
			wrapper.setProps({ searchActive: !wrapper.props().searchActive });
		}
	});
	it('matches snapshot when open', () => {
		const tree = renderer.create(<Footer {...props} />).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('matches snapshot when closed', () => {
		const tree = renderer
			.create(<Footer {...props} isScrollingDown />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('should toggle each setting', () => {
		wrapper.find('#profile-button').simulate('click');
		expect(props.toggleProfile).toHaveBeenCalledTimes(1);

		wrapper.find('#search-button').simulate('click');
		expect(props.toggleSearch).toHaveBeenCalledTimes(1);

		wrapper.find('#notebook-button').simulate('click');
		expect(props.toggleNotebook).toHaveBeenCalledTimes(1);

		wrapper.find('#settings-button').simulate('click');
		expect(props.toggleSettingsModal).toHaveBeenCalledTimes(1);
	});
});
