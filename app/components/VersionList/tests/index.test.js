import React from 'react';
import renderer from 'react-test-renderer';
// import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import { fromJS } from 'immutable';
import { VersionList } from '..';
import { getTexts } from '../../VersionListSection/tests/versionListSectionUtils';

jest.mock('react-intl', () => ({
	FormattedMessage: (props) => <span>{props.defaultMessage}</span>,
	defineMessages: (messages) => messages,
}));

const props = {
	dispatch: jest.fn(),
	setActiveText: jest.fn(),
	toggleTextSelection: jest.fn(),
	activeTextId: 'ENGESV',
	filterText: '',
	active: true,
	loadingVersions: false,
};
// const mockStore = configureStore();
// const store = mockStore(fromJS(props));
let bibles = fromJS([]);
describe('<VersionList />', () => {
	beforeEach(async () => {
		const jsBibles = await getTexts({ languageCode: 6414 });
		bibles = fromJS(jsBibles);
	});
	it('Should match previous snapshot', () => {
		const tree = renderer
			.create(<VersionList {...props} bibles={bibles} />)
			.toJSON();

		expect(tree).toMatchSnapshot();
	});
	it('Should contain a list of version names', () => {
		const wrapper = mount(<VersionList {...props} bibles={bibles} />);

		expect(wrapper.find('.version-name-list').length).toEqual(1);
	});
});
